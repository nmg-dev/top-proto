# -*- coding:utf-8 -*-
from datetime import datetime
import mysql.connector
import json
import os, os.path
import re

import traceback

__mysql_config = {}
if os.path.exists('./seeding.database.json') :
    with open('./seeding.database.json', encoding='utf8') as dbfp : __mysql_config = json.load(dbfp)

__table_names = ('tags','campaigns','users','campaign_grants','campaign_performances','tag_affiliations')
__table_schema = {
    'users': '''CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        gid VARCHAR(45) NOT NULL,
        access JSON NULL,
        profile JSON NULL,
        can_admin TINYINT NOT NULL DEFAULT 0,
        can_input TINYINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        deleted_at TIMESTAMP NULL,
        blocked_at TIMESTAMP NULL,
        PRIMARY KEY (id)) ENGINE = InnoDB;''',
    'campaigns': '''CREATE TABLE IF NOT EXISTS campaigns (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(200) NULL,
        memo TEXT NULL,
        asset TEXT NULL,
        period_from TIMESTAMP NOT NULL,
        period_till TIMESTAMP NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        deleted_at TIMESTAMP NULL,
        created_by INT UNSIGNED NULL,
        updated_by INT UNSIGNED NULL,
        deleted_by INT UNSIGNED NULL,
        PRIMARY KEY (id)) ENGINE = InnoDB;''',
    'campaign_grants': '''CREATE TABLE IF NOT EXISTS campaign_grants (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        scope ENUM('own', 'manage', 'view') NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        campaign_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP NULL,
        PRIMARY KEY (id),
        INDEX fk_campaign_grant_user_idx (user_id ASC),
        INDEX fk_campaign_grant_campaign_idx (campaign_id ASC),
        UNIQUE INDEX unique_campaign_grant (campaign_id ASC, user_id ASC, scope ASC),
        CONSTRAINT fk_campaign_grant_user
            FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
        CONSTRAINT fk_campaign_grant_campaign
            FOREIGN KEY (campaign_id)
            REFERENCES campaigns (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION) ENGINE = InnoDB;''',
    'tags': '''CREATE TABLE IF NOT EXISTS tags (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        class VARCHAR(30) NOT NULL,
        name VARCHAR(60) NOT NULL,
        priority INT UNSIGNED NOT NULL DEFAULT 1,
        property JSON NULL,
        PRIMARY KEY (id),
        INDEX idx_tag_class (class ASC, name ASC)) ENGINE = InnoDB;''',
    'campaign_performances': '''CREATE TABLE IF NOT EXISTS campaign_performances (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        day_id DATE NOT NULL,
        campaign_id INT UNSIGNED NOT NULL,
        impression BIGINT UNSIGNED NULL,
        click BIGINT UNSIGNED NULL,
        conversion BIGINT UNSIGNED NULL,
        cost BIGINT UNSIGNED NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        created_by INT UNSIGNED NULL,
        updated_by INT UNSIGNED NULL,
        INDEX fk_campaign_performance_idx (campaign_id ASC),
        PRIMARY KEY (id),
        INDEX idx_daily_performance (day_id ASC) ,
        INDEX idx_campaign_performance (campaign_id ASC) ,
        CONSTRAINT fk_campaign_performance
            FOREIGN KEY (campaign_id)
            REFERENCES campaigns (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION) ENGINE = InnoDB;''',
    'tag_affiliations': '''CREATE TABLE IF NOT EXISTS tag_affiliations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        campaign_id INT UNSIGNED NOT NULL,
        tag_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        INDEX fk_campaign_meta_campaign_idx (campaign_id ASC) ,
        INDEX fk_campaign_meta_attribute_idx (tag_id ASC) ,
        CONSTRAINT fk_campaign_meta_campaign
            FOREIGN KEY (campaign_id)
            REFERENCES campaigns (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
        CONSTRAINT fk_campaign_meta_tags
            FOREIGN KEY (tag_id)
            REFERENCES tags (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION) ENGINE = InnoDB;'''
}

cnx = mysql.connector.connect(**__mysql_config)
cs = cnx.cursor()

tag_classes = (
    'category',
    'subcategory',
    'account',
    'brand',
    'goal',
    'device',
    'media',
    'adtype',
    'admedia',
    'period',
    'date',
    'impression',
    'click',
    'cost',
    'conversion',
    'design.creative',
    'design.layout',
    'design.background',
    'design.objet',
    'design.button',
    'design.shape',
    'content.benefit',
    'content.keytopic',
    'content.keyword',
    'content.trigger',
    'content.adcopy'
)

tag_classes_to_excludes = (
    'date','impression','click','cost','conversion',
)

campaign_key_classes = (
    'category',
    'subcategory',
    'account',
    'brand',
    'goal',
    'device',
    'media',
    'adtype',
    'admedia',
    'period',
    'design.layout',
    'design.background',
    'design.objet',
    'design.button',
    'design.shape',
    'content.benefit',
    'content.keytopic',
    'content.keyword',
    'content.trigger',
    'content.adcopy'
)

campaign_aff_classes = (
    'category',
    'subcategory',
    'account',
    'brand',
    'goal',
    'device',
    'media',
    'adtype',
    'admedia',
    'design.layout',
    'design.background',
    'design.objet',
    'design.button',
    'design.shape',
    'content.benefit',
    'content.keytopic',
    'content.keyword',
    'content.trigger',
    'content.adcopy'
)

tags = {cls:{} for cls in tag_classes}
tag_autoinc = 0
campaigns = {}
performances = {}
filename_pattern = re.compile(r'.+\.tsv', re.IGNORECASE)
text_wrapper_pattern = re.compile(r'^\s*"(.*)"\s*$')
integer_pattern = re.compile(r'[^\d]')

def drop_tables(tablenames) :
    for tb in reversed(tablenames) :
        cs.execute('DROP TABLE IF EXISTS %s'%(tb))
    cnx.commit()

def create_tables() :
    for tb in __table_names :
        cs.execute(__table_schema[tb])
    cnx.commit()

def _from_file_line_content(c,t) :
    cls = tag_classes[c]
    tm = text_wrapper_pattern.match(t)
    t = tm.group(1) if tm is not None else t
    return t.strip()

def _campaign_key_from_values(line_values) :
    try :
        vs = [str(tags[cc][line_values[cc]] if line_values[cc] is not None and 0<len(line_values[cc]) else '') for cc in campaign_key_classes]
        return '|'.join(vs)
    except:
        traceback.print_exc()
        return None

def _perform_value_date(date_str) :
    try :
        return datetime.strptime(date_str,'%Y-%m-%d') if date_str is not None and 0<len(date_str) else None
    except :
        traceback.print_exc()
        return None
def _perform_value_int(int_str) :
    try :
        return int(integer_pattern.sub('', int_str)) if int_str is not None and 0<len(int_str.strip()) else None
    except:
        traceback.print_exc()
        return None

def seeding_from_file(filepath, sep='\t', include_header=False) :
    global tags, tag_autoinc, campaigns
    lines = None
    with open(filepath, encoding='utf8') as fin :
        lines = [line.strip() for line in fin.readlines()]

    for ln in range(0 if include_header else 1, len(lines)) :
        tokens = lines[ln].strip().split(sep)
        #crange = range(0, min((len(tokens), len(tag_classes))))
        line_values = { \
            tag_classes[c]:(_from_file_line_content(c,tokens[c]) if len(tokens)>c else None) 
            for c in range(0, len(tag_classes)) }
        for k,v in line_values.items() :
            if k in tag_classes_to_excludes : continue
            if v is None or len(v.strip())<=0 : continue
            v = v.strip()
            if v not in tags[k] :
                tag_autoinc += 1
                tags[k][v] = tag_autoinc
        ck = _campaign_key_from_values(line_values)
        if ck is None : continue
        if ck not in campaigns : 
            print(line_values)
            ctitle = '[{account}] {brand} -{device},{media},{adtype},{admedia}'.format(**line_values)
            if line_values['period'] is None : continue
            periods = line_values['period'].split('~')
            period_from = None
            period_till = None
            try :
                if 2<=len(periods) :
                    period_from = datetime.strptime(periods[0], '%Y/%m/%d')
                    period_till = datetime.strptime(periods[1], '%Y/%m/%d')
                elif 1==len(periods) :
                    p = datetime.fromordinal(datetime(1900, 1, 1).toordinal() + int(periods[0]) - 2)
                    period_from = p
                    period_till = p
                
                tks = tuple(tags[c][line_values[c]] \
                    if c in tags and c in line_values and line_values[c] in tags[c] else ''\
                    for c in campaign_aff_classes)
                campaigns[ck] = (ctitle, period_from, period_till,tks)
            except :
                traceback.print_exc()
                continue

        if ck not in performances : 
            performances[ck] = []
        performance = ( \
            _perform_value_date(line_values['date']), \
            _perform_value_int(line_values['impression']), \
            _perform_value_int(line_values['click']), \
            _perform_value_int(line_values['cost']), \
            _perform_value_int(line_values['conversion']))
        performances[ck].append(performance)

def seeding_data_tag(tags) :
    global cnx, cs

    tids = {}
    for cls in campaign_aff_classes :
        # insertion
        for tag in tags[cls].keys() :
            if tag is None : continue
            cs.execute('INSERT INTO tags (class,name) VALUES (%s,%s)', (cls, tag))
            tids[tags[cls][tag]] = cs.lastrowid

        cnx.commit()
    return tids

def seeding_data_campaign(campaigns) :
    global cnx, cs

    cids = {}
    for ck,cv in campaigns.items() :
        cs.execute('''INSERT INTO campaigns 
            (title, period_from, period_till, created_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)''', cv[0:3])
        cids[ck] = cs.lastrowid
    cnx.commit()

    return cids

def seeding_data_campaign_tag(tags, tids, campaigns, cids) :
    global cnx, cs
    
    for ck,cv in campaigns.items() :
        try :
            cid = cids[ck]
            for tk in cv[-1] :
                if tk not in tids or tids[tk] is None or tids[tk]<=0 : continue
                cs.execute('''INSERT INTO tag_affiliations
                (campaign_id, tag_id) VALUES(%s,%s)''', (cid, tids[tk]))
            cnx.commit()
        except:
            traceback.print_exc()
            continue

def seeding_data_campaign_performance(campaigns, performances, cids) :
    global cnx, cs

    for ck,pfs in performances.items() :
        try :
            cid = cids[ck]
            cnts = 0
            for cv in pfs :
                if cv[0] is None : continue
                cs.execute('''INSERT INTO campaign_performances
                    (campaign_id, day_id, impression, click, cost, conversion, created_at)
                    VALUES(%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)''', (cid,)+cv)
                cnts += 1
            cnx.commit()
            print('%s campaign records: %d/%d'%(ck, cnts, len(pfs)))
        except:
            traceback.print_exc()
            continue



if __name__ == '__main__' :
    folder = '.'
    for fname in os.listdir(folder) :
        if not filename_pattern.match(fname) : continue
        fpath = '%s/%s'%(folder, fname)
        print('open-file %s'%(fpath))
        seeding_from_file(fpath)

    to_clear = ('campaigns', 'campaign_grants', 'campaign_performances', 'tags', 'tag_affiliations')

    # drop tables
    drop_tables(to_clear)

    # create blank
    create_tables()
    
    # insert & get tags, tag ids
    tids = seeding_data_tag(tags)
    # insert campaigns
    cids = seeding_data_campaign(campaigns)
    # insert tag_affiliations
    seeding_data_campaign_tag(tags, tids, campaigns, cids)
    # insert campaign_performances
    seeding_data_campaign_performance(campaigns, performances, cids)

    # flush
    cnx.commit()
    cnx.close()
    
        
        
        
