cd /mnt/e/planetpass/ || exit
mkdir videos
cd raw || exit

for i in {0..8888}; do
  cd "${i}" || exit
  count=$(find ./*.wav 2>/dev/null | wc -l)
  if [ "$count" -gt 1 ]; then
    # wav files found
    files=$(find ./ -name '*.wav' -printf '-v 1 %p ')

    sox -m ${files} output_stage1.wav

    # Use compand
    ffmpeg -i output_stage1.wav -filter_complex \
    "compand=attacks=0:points=-80/-900|-45/-15|-27/-9|0/-2|20/-2:volume=-90" \
    output_stage2.wav

    # Pass 1 for loudnorm
    ffmpeg -hide_banner -i output_stage2.wav -af "loudnorm=i=-16:tp=-2:lra=11:print_format=json" -f null - 2>&1 >/dev/null | tail -n12 > loudnorm_pass.json
    
    # Read variables
    input_i=$(jq -r '.input_i' loudnorm_pass.json)
    input_tp=$(jq -r '.input_tp' loudnorm_pass.json)
    input_lra=$(jq -r '.input_lra' loudnorm_pass.json)
    input_thresh=$(jq -r '.input_thresh' loudnorm_pass.json)
    target_offset=$(jq -r '.target_offset' loudnorm_pass.json)

    # Pass 2 for loudnorm
    ffmpeg -i output_stage2.wav -af "loudnorm=i=-11.5:tp=-2:lra=11:measured_i=${input_i}:measured_lra=${input_lra}:measured_tp=${input_tp}:measured_thresh=${input_thresh}:offset=${target_offset}:linear=true" -ar 48k output_stage3.wav

    # Assemble mp4
    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -i output_stage3.wav -c:a aac -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
    
    # Clean up so if we re-run it doesn't get mixed again
    rm output_stage1.wav output_stage2.wav output_stage3.wav loudnorm_pass.json
  elif [ "$count" == 1 ]; then
    # Only 1 wav file found, sox can't combine
    name=$(find ./*.wav)

    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -i "$name" -c:a aac -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
  else
    # No wav files found
    ffmpeg -r 15 -start_number 0 -i "${i}_%05d.png" -c:v libx264 -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 ../../videos/"${i}".mp4
  fi
  cd ..
done
