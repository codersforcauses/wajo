#!/bin/bash
(cd server && ./dev.sh) & (cd client && npm run dev )
