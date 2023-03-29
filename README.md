# JgrtowyAPI

My own API, for projects and everything else.
Using ExpressJS and TypeScript.

## Request form for RCON

The request form is a simple JSON object with the following fields:

-    `host` - The hostname of the server
-    `port` - The port of the server
-    `password` - The RCON password of the server
-    `command` - The command to send to the server

Make request to <http://api.jgrtowy.xyz/rcon> to send command. Some commands can reply with response, but some commands don't reply with anything.
