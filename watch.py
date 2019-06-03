#! -*- coding: utf8 -*-

import os
import re
import requests
import psutil
import sqlite3
import json
import datetime

db_path = './.watch.sqlite'
db_table = 'monitors'
watch_uri = 'http://localhost:8080'
watch_timeout = 5
watch_max_retries = 5
ps_name = 'top-proto'
#ps_pattern = re.compile(r'%s'%(ps_name))

db_table_create = '''create table %s (
    http_status text,
    retries int,
    respond_ms real,
    ps_status text,
    pid int,
    cpu real,
    memory real,
    misc text,
    restarted int,
    timestamp int)'''%(db_table)
db_table_insert = '''insert into %s 
    (http_status, retries, respond_ms, ps_status, pid, cpu, memory, misc, restarted, timestamp)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''%(db_table)

now = datetime.datetime.utcnow()
misc = ''

# open database
cnx = sqlite3.connect(db_path)
cs = cnx.cursor()

# check db table exists
cs.execute('PRAGMA table_info("%s")'%(db_table))
table_schema = [ col for col in cs ]
if len(table_schema) <=0 :
    # create table
    misc += 'TABLE INITIALIZED'
    cs.execute(db_table_create)
    cnx.commit()

# watch path
retries = -1
resp = None
response_time = -1
is_alive = 1

while retries < watch_max_retries and resp is None :
    try :
        resp = requests.get(watch_uri, timeout=watch_timeout)
        if resp.ok :
            break
        if resp is not None :
            misc += '\nNE:[%d]%s etime: %.3f'%(resp.status_code, watch_uri, resp.elapsed.total_seconds())
    except Exception as ex:
        misc += '\n!E:%s'%(str(ex))
        continue
    finally:
        retries += 1
    resp = None

# watch process
procs = [ps for ps in psutil.process_iter()]
proc = None
for ps in procs :
    if ps_name == ps.name() :
        proc = ps
        break
if proc is None :
    is_alive = 0
    misc += '\nPROCESS LOST'
elif resp is None or not resp.ok :
    # process must die
    prs_to_kill = filter(lambda pp: ps_pattern.match(p.name()), procs)
    misc += '\nKILL PROCESS %s'%(str(map(lambda p: '[%d] %s'%(p.pid, p.name()), prs_to_kill)))
    is_alive = 0
    map(lambda p: p.kill(), prs_to_kill)

# rebirth
if is_alive < 1 :
    misc += '\nRESTART'
    os.system('./%s &'%(ps_name))

# push back records
log = (
    # http_status
    '[%d] %s'%(resp.status_code, str(resp.headers)) if resp is not None else None,
    # retries
    retries,
    # respond_ms
    resp.elapsed.total_seconds() if resp is not None and resp.ok else None,
    # ps_status
    ps.status(),
    # pid
    ps.pid,
    # cpu
    ps.cpu_percent(),
    # memory
    ps.memory_percent(),
    # misc
    misc,
    # restarted
    0 if 0<is_alive else 1,
    # timestamp
    now)

cs.execute(db_table_insert, log)
cnx.commit()

exit()
