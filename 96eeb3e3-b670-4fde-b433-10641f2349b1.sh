if [ "$(git ls-files | wc -l)" -gt 0 ]; then
  git rm -rf .
fi
cp -r /home/runner/work/_temp/* ./
rm -rf node_modules pnpm-lock.yaml
