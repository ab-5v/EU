dir=`pwd`
usrdir=$(dir)/users/$(uid)
subj_ca=/C=RU/ST=MO/L=Moscow/O=EU/OU=DEV/CN=UECA/EA=eusa@eu
subj_srv=/C=RU/ST=MO/L=Moscow/O=EU/OU=DEV/CN=UESRV/EA=eusrv@eu
subj_usr=/C=RU/ST=MO/L=Moscow/O=EU/OU=DEV/CN=$(uid)/EA=eusrv@eu
nginx=/etc/nginx/ssl
passphrase=lalala

cfg:
	if test -d newcerts; then rm -rf newcerts; fi
	mkdir newcerts
	sed -e "s|;DIR;|$(dir)|" ssl.conf >> /etc/ssl/openssl.cnf

ca:
	if test -d CA; then rm -rf CA; fi
	mkdir CA
	# Генерируем СА ключ.
	openssl genrsa -out CA/ca.key 2048
	# Генерируем запрос на сертификат для ключа (Certificate Signing Request).
	openssl req -new -key CA/ca.key -out CA/ca.csr -subj $(subj_ca)
	# Для тестов подойдёт самоподписанный корневой сертификат
	# Хотя с ним есть броблемы в сафари, но платить $300 за подпись у тафти как-то не хочется
	openssl x509 -req -days 3650 -in CA/ca.csr -signkey CA/ca.key -out CA/ca.crt
	# Устанавливаем серийный номер, с которого начнётся индексирование наших сертификатов
	echo ACE0 > CA/serial
	# Создаём CA-базу данных ключей.
	touch CA/index.txt
	# Создаём список для отозванных сертификатов - CRL (Certificate Revocation List)
	openssl ca -gencrl -out CA/ca.crl -crldays 7 -name eu

server:
	if test -d SRV; then rm -rf SRV; fi
	mkdir SRV
	# Создаём ключ для сервера, без пароля, чтобы не пришлось вводить его при запуске nginx
	openssl genrsa -out SRV/server.key 2048
	# Генерируем запрос на сертификат для сервера
	openssl req -new -key SRV/server.key -out SRV/server.csr -subj $(subj_srv)
	# Подписываем его нашим СА
	openssl ca -in SRV/server.csr -cert CA/ca.crt -keyfile CA/ca.key -out SRV/server.crt -name eu -batch

install:
	# копируем ключи в директорию с nginx и перезапускаем его
	cp CA/ca.crt $(nginx)/ca.crt
	cp CA/ca.crl $(nginx)/ca.crl
	cp SRV/server.crt $(nginx)/server.crt
	cp SRV/server.key $(nginx)/server.key
	/etc/init.d/nginx restart

adduser:
	# Будем хранить все пользовательские ключи, а пользователям посылать p12
	# Естественно хранить их недо не в wwwroot
	mkdir -p users
	if test -d $(usrdir); then rm -rf $(usrdir); fi
	mkdir -p $(usrdir)
	# Создаём сертификат для переданного пользователя с заданным паролем
	openssl genrsa -des3 -passout pass:$(passphrase) -out $(usrdir)/$(uid).key 2048
	# CSR
	openssl req -new -key $(usrdir)/$(uid).key -out $(usrdir)/$(uid).csr -passin pass:$(passphrase) -subj $(subj_usr)
	# Подписываем пользовательский сертификат нашим CA
	openssl ca -in $(usrdir)/$(uid).csr -cert $(dir)/CA/ca.crt -keyfile $(dir)/CA/ca.key -out $(usrdir)/$(uid).crt -name eu -batch
	# Экспортируем сертификат в PKC12, которую понимают броузеры
	# Пароль для экспорта - q
	openssl pkcs12 -export -clcerts -in $(usrdir)/$(uid).crt -inkey $(usrdir)/$(uid).key -passout pass:q -passin pass:$(passphrase) -out $(usrdir)/$(uid).p12

revokeuser:
	# Отзываем сертификат указанного пользователя
	openssl ca -revoke $(usrdir)/$(uid).crt -name eu
	# Обновляем CRL исходя из новой информации в index.txt
	openssl ca -gencrl -out $(dir)/CA/ca.crl -crldays 7 -name eu
