# -*- coding:utf-8 -*-
from datetime import datetime
import mysql.connector
import json
import os, os.path
import re

__mysql_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'tagop',
    'user': 'nmg-to',
    'password': 'nmg-tagOperation.v2018.proto',
    'charset': 'utf8mb4',
    'use_unicode': True
}

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
        class VARCHAR(20) NOT NULL,
        name VARCHAR(20) NOT NULL,
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

tags = {cls:{} for cls in tag_classes}
tag_autoinc = 0
campaigns = {}
performances = []
filename_pattern = re.compile(r'.+\.tsv', re.IGNORECASE)
text_wrapper_pattern = re.compile(r'^\s*"(.*)"\s*$')
integer_pattern = re.compile(r'[^\d]')

def drop_tables() :
    for tb in reversed(__table_names) :
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
    return t

def _campaign_key_from_values(line_values) :
    return '|'.join(str(tags[cc][line_values[cc]]) for cc in campaign_key_classes)

def _perform_value_date(date_str) :
    return datetime.strptime(date_str,'%Y%m%d') if date_str is not None else None
def _perform_value_int(int_str) :
    return int(integer_pattern.sub('', int_str)) if int_str is not None and 0<len(int_str) else None

def seeding_from_file(filepath, sep='\t', include_header=False) :
    global tag_autoinc
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
            if v not in tags[k] :
                tag_autoinc += 1
                tags[k][v] = tag_autoinc
        ck = _campaign_key_from_values(line_values)
        if ck not in campaigns :
            campaigns[ck] = []
        performance = ( \
            _perform_value_date(line_values['date']), \
            _perform_value_int(line_values['impression']), \
            _perform_value_int(line_values['click']), \
            _perform_value_int(line_values['conversion']))

        print((ck, ) + performance)


if __name__ == '__main__' :
    folder = '.'
    for fname in os.listdir(folder) :
        if not filename_pattern.match(fname) : continue
        fpath = '%s/%s'%(folder, fname)
        seeding_from_file(fpath)

        # TODO: clear databases

        # TODO: insert tags

        # TODO: insert campaigns

        # TODO: insert tag_affiliations

        # TODO: insert campaign_performances

        
    
        
        
        
