#!/bin/bash
mysql --user=dbuser --password=password chore_goblin
day_of_week=$(date +'%w')
echo $day_of_week
sleep 5