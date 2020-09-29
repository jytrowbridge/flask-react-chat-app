import os
from flask import Flask, request, render_template, make_response, session
import flask_socketio
import random

from static.adj_list import adj_list
from static.noun_list import noun_list

app = Flask(__name__)
socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
app.secret_key = b'\x0f}\x88\xb3\x16\x0fnfC\x7f\x0c\x1e\xb2OSt\xcem\xa5\x04X\xd8\xba<'

usernames = {}

@app.route('/')
def index():
    resp = make_response(render_template('index.html'))
    print(session)
    if not request.cookies.get('user_id'):
        id = str(os.urandom(10).hex())
        user_name = random.choice(adj_list) + '_' + random.choice(noun_list)
        while user_name in usernames:
            user_name = random.choice(adj_list)
        usernames[user_name] = True
        resp.set_cookie(
                'user_id',
                id,
                samesite='Strict'
            )
        resp.set_cookie(
                'user_name',
                user_name,
                samesite='Strict'
            )
    return resp


@socketio.on('connect')
def on_connect():
    user_name = request.cookies.get('user_name')
    print(f'{user_name} connected!')
    socketio.emit('connected', {
        'user_name': user_name
    })


@socketio.on('disconnect')
def on_disconnect():
    user_name = request.cookies.get('user_name')
    print(f'{user_name} disconnected!')
    socketio.emit('disconnected', {
        'user_name': user_name
    })

@socketio.on('send:message')
def send_message(data):
    print("Got an event for new message with data:", data)
    message = data['message']
    user_id = data['user_id']
    user_name = data['user_name']
    socketio.emit('message received', {
        'message': message,
        'user_id': user_id,
        'user_name': user_name
    })

@socketio.on('update_username')
def change_username(data):
    print("Got change_username event with data: ", data)
    socketio.emit('change username', data)


if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 80)),
        debug=True
    )
