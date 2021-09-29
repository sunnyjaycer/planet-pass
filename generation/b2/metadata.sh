cd /mnt/e/planetpass/metadata2/$2 || exit

for file in *; do
    b2 upload_file --threads 24 --contentType application/json $1 $file metadata/$2/$file
done