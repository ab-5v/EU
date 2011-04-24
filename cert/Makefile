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
	# Generate the key.
	openssl genrsa -out CA/ca.key 2048
	# Generate a certificate request.
	openssl req -new -key CA/ca.key -out CA/ca.csr -subj $(subj_ca)
	# Self signing key is bad... this could work with a third party signed key... registeryfly has them on for $16 but I'm too cheap lazy to get one on a lark.
	# I'm also not 100% sure if any old certificate will work or if you have to buy a special one that you can sign with. I could investigate further but since this
	# service will never see the light of an unencrypted Internet see the cheap and lazy remark.
	# So self sign our root key.
	openssl x509 -req -days 3650 -in CA/ca.csr -signkey CA/ca.key -out CA/ca.crt
	# Setup the first serial number for our keys... can be any 4 digit hex string... not sure if there are broader bounds but everything I've seen uses 4 digits.
	echo ACE0 > CA/serial
	# Create the CA's key database.
	touch CA/index.txt
	# Create a Certificate Revocation list for removing 'user certificates.'
	openssl ca -gencrl -out CA/ca.crl -crldays 7 -name eu

server:
	if test -d SRV; then rm -rf SRV; fi
	mkdir SRV
	# Create us a key. Don't bother putting a password on it since you will need it to start apache. If you have a better work around I'd love to hear it.
	openssl genrsa -out SRV/server.key 2048
	# Take our key and create a Certificate Signing Request for it.
	openssl req -new -key SRV/server.key -out SRV/server.csr -subj $(subj_srv)
	# Sign this bastard key with our bastard CA key.
	openssl ca -in SRV/server.csr -cert CA/ca.crt -keyfile CA/ca.key -out SRV/server.crt -name eu -batch

install:
	cp CA/ca.crt $(nginx)/ca.crt
	cp SRV/server.crt $(nginx)/server.crt
	cp SRV/server.key $(nginx)/server.key
	/etc/init.d/nginx restart

adduser:
	# The base of where our SSL stuff lives.
	# Were we would like to store keys... in this case we take the username given to us and store everything there.
	mkdir -p users
	if test -d $(usrdir); then rm -rf $(usrdir); fi
	mkdir -p $(usrdir)
	# Let's create us a key for this user... yeah not sure why people want to use DES3 but at least let's make us a nice big key.
	openssl genrsa -des3 -passout pass:$(passphrase) -out $(usrdir)/$(uid).key 2048
	# Create a Certificate Signing Request for said key.
	openssl req -new -key $(usrdir)/$(uid).key -out $(usrdir)/$(uid).csr -passin pass:$(passphrase) -subj $(subj_usr)
	# Sign the key with our CA's key and cert and create the user's certificate out of it.
	openssl ca -in $(usrdir)/$(uid).csr -cert $(dir)/CA/ca.crt -keyfile $(dir)/CA/ca.key -out $(usrdir)/$(uid).crt -name eu -batch
	# This is the tricky bit... convert the certificate into a form that most browsers will understand PKCS12 to be specific.
	# The export password is the password used for the browser to extract the bits it needs and insert the key into the user's keychain.
	# Take the same precaution with the export password that would take with any other password based authentication scheme.
	openssl pkcs12 -export -clcerts -in $(usrdir)/$(uid).crt -inkey $(usrdir)/$(uid).key -passout pass:q -passin pass:$(passphrase) -out $(usrdir)/$(uid).p12

revokeuser:
	# Revoke a certificate and update the CRL.
	# Revoke a particular user's certificate.
	openssl ca -revoke $(usrdir)/$(uid).crt -name eu
	# Update the CRL with the new info from the database (ie. index.txt)
	openssl ca -gencrl -out $(dir)/CA/ca.crl -crldays 7 -name eu
