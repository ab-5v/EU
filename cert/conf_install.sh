#!/bin/sh
sed -e "s|;DIR;|`pwd`|" ssl.conf >> 1
