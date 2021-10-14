cd /mnt/e/planetpass/raw/ || exit

mkdir ../thumbnail
for i in {0..8887}; do
    cd "${i}" || exit
    cp ${i}_00075.png ../thumbnail/
    cd ..
done