cd /mnt/e/planetpass/raw/ || exit

nthFrame=75

for i in {0..8887}; do
    cd "${i}" || exit
    b2 upload_file --threads 24 $1 ${i}_00075.png thumbnail/$2/${i}.png
    cd ..
done