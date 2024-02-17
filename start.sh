#!/bin/bash

cd /root/idx0-api
npm install
pm2 start server.js
pm2 save --force