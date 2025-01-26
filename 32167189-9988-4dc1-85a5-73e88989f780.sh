if [ "$branch_exists" = "false" ]; then
  git checkout --orphan build
  git reset --hard
  git clean -fd
  git commit --allow-empty -m "初始化 build 分支"
  git push --set-upstream -f origin build
else
  git fetch origin build
  git reset --hard
  git clean -fd
  git reset --hard origin/build
  git checkout build
fi
