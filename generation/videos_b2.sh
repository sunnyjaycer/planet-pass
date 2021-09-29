cd /mnt/e/planetpass/videos || exit

for file in *; do
    b2 upload_file --threads 24 $1 $file $2/$file
done