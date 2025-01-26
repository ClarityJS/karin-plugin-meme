if git ls-remote --exit-code origin build; then
  echo "branch_exists=true" >> $GITHUB_ENV
else
  echo "branch_exists=false" >> $GITHUB_ENV
fi
