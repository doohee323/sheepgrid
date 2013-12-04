echo ''
echo ''
echo '----------------------------------------------'
echo '----------------<< upload to heroku >>--------'
echo '----------------------------------------------'
echo '#heroku login'

git add .
git commit -m "go to heroku" 
heroku git:remote -a sheepgrid
git subtree push --prefix dist heroku master


