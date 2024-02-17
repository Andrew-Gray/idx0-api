#!/bin/bash

cd /root/idx0-api
git pull
npm install
pm2 restart server.js