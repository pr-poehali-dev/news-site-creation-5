import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and authorization API
    Args: event with httpMethod, body (login/register/logout/verify)
    Returns: HTTP response with user data or token
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            if action == 'login':
                username = body_data.get('username')
                password = body_data.get('password')
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, username, email, full_name, role, is_active FROM users WHERE username = %s AND password_hash = %s",
                    (username, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Неверные учетные данные'}),
                        'isBase64Encoded': False
                    }
                
                if not user['is_active']:
                    return {
                        'statusCode': 403,
                        'headers': headers,
                        'body': json.dumps({'error': 'Аккаунт заблокирован'}),
                        'isBase64Encoded': False
                    }
                
                token = generate_token()
                expires_at = datetime.now() + timedelta(days=7)
                
                cur.execute(
                    "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                    (user['id'], token, expires_at)
                )
                
                cur.execute(
                    "UPDATE users SET last_login = %s WHERE id = %s",
                    (datetime.now(), user['id'])
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'user': dict(user),
                        'token': token
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'register':
                username = body_data.get('username')
                email = body_data.get('email')
                password = body_data.get('password')
                full_name = body_data.get('full_name', '')
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "INSERT INTO users (username, email, password_hash, full_name, role) VALUES (%s, %s, %s, %s, %s) RETURNING id, username, email, full_name, role",
                    (username, email, password_hash, full_name, 'junior_moderator')
                )
                user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'user': dict(user)}),
                    'isBase64Encoded': False
                }
            
            elif action == 'logout':
                token = event.get('headers', {}).get('X-Auth-Token')
                if token:
                    cur.execute("UPDATE sessions SET expires_at = %s WHERE token = %s", (datetime.now(), token))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Успешный выход'}),
                    'isBase64Encoded': False
                }
            
        except psycopg2.IntegrityError as e:
            conn.rollback()
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Пользователь с таким именем или email уже существует'}),
                'isBase64Encoded': False
            }
        finally:
            cur.close()
            conn.close()
    
    elif method == 'GET':
        token = event.get('headers', {}).get('X-Auth-Token')
        
        if not token:
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Токен не предоставлен'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            cur.execute(
                """
                SELECT u.id, u.username, u.email, u.full_name, u.role, u.is_active, u.last_login, u.created_at
                FROM users u
                JOIN sessions s ON u.id = s.user_id
                WHERE s.token = %s AND s.expires_at > %s
                """,
                (token, datetime.now())
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный или истекший токен'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'user': dict(user)}),
                'isBase64Encoded': False
            }
        finally:
            cur.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }