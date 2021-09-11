cd /mnt/e/planetpass/ || exit
mkdir videos
cd raw || exit

for i in {0..8887}; do
  cd "${i}" || exit
  count=$(find ./*.wav 2>/dev/null | wc -l)
  if [ "$count" -gt 1 ]; then
    # wav files found
    sox -m ./*.wav output.wav
    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -i output.wav -c:a aac -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
    # clean up so if we re-run it doesn't get mixed again
    rm output.wav
  elif [ "$count" == 1 ]; then
    # only 1 wav file found, sox can't combine
    name=$(find ./*.wav)
    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -i "$name" -c:a aac -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
  else
    # no wav files found
    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
  fi
  cd ..
done
