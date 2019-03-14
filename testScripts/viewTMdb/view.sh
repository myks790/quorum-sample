#!/usr/bin/env bash
echo "3번 tm db확인"
echo "url : 127.0.0.1:8082"
echo "JDBC URL = jdbc:h2:/h2/tm/db | User Name = sa"
echo " "

docker exec -it quorum_txmanager3_1 /bin/sh -c "mkdir -p /h2
 cp -r /qdata/tm /h2/
 wget -O /h2/h2.jar http://repo2.maven.org/maven2/com/h2database/h2/1.4.197/h2-1.4.197.jar
 java -jar /h2/h2.jar -webAllowOthers"