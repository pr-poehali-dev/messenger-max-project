import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Получить данные текущего пользователя по токену сессии"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    auth = headers.get('X-Authorization') or headers.get('authorization') or ''
    token = auth.replace('Bearer ', '').strip()

    if not token:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Нет токена'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p24027735_messenger_max_projec')
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        f"""SELECT u.id, u.name, u.phone
            FROM {schema}.sessions s
            JOIN {schema}.users u ON u.id = s.user_id
            WHERE s.token=%s AND s.expires_at > NOW()""",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия недействительна'})}

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'user': {'id': row[0], 'name': row[1], 'phone': row[2]}})
    }
