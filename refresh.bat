docker stop game

docker rm -v game

docker build -t avneet7193/game .

docker run -p 8080:3000 -d --name game avneet7193/game