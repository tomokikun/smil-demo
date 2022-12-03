# create dir
svg_name=$1
dir_name=example/$svg_name
mkdir $dir_name

# create svg file
cat << EOF > $dir_name/${svg_name}.svg
<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
  <circle r="10" cx="10" cy="10" fill="pink">
    <animate
      attributeName="cx"
      from="10"
      to="290"
      dur="6s"
      begin="0s"
      repeatCount="indefinite" />
  </circle>
</svg>
EOF

# create readme
cat << EOF > $dir_name/${svg_name}.md
# $svg_name
![$svg_name](./$svg_name.svg)
EOF
