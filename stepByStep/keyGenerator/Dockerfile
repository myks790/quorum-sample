FROM quorumengineering/quorum:2.2.1

MAINTAINER SangHun Kang <myks790@gmail.com>

VOLUME /keys
WORKDIR /keys

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["echo 'ex) geth --datadir /keys account new --password /keys/pw && bootnode --genkey=nodeKey1'"]