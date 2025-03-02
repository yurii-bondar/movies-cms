# Movies CMS

#### Service technology stack:
- express.js (REST framework)
- sqlite (as sql database)
- leveldb (as cache service)


If you would like to use something more powerful as a database and cache service, you can use the 
docker compose settings in my repository [maintenance-services](https://github.com/yurii-bondar/maintenance-services).
<br><br>
There you will find [postgres](https://github.com/yurii-bondar/maintenance-services/blob/main/compose.yaml#L6) 
and [mariadb](https://github.com/yurii-bondar/maintenance-services/blob/main/compose.yaml#L18) as sql databases,
regarding cache services [redis](https://github.com/yurii-bondar/maintenance-services/blob/main/compose.yaml#L77) and
[memcached](https://github.com/yurii-bondar/maintenance-services/blob/main/compose.yaml#L105)


#### You can find a ready-made Docker image on my Docker Hub at the link [movies-cms](https://hub.docker.com/r/bondevn/movies) or run immediately with the command
```bash
docker run --name movies -p 8000:8050 -e APP_PORT=8050 bondevn/movies
```
#### in the terminal you will see the following
```bash
> docker run --name movies -p 8000:8050 -e APP_PORT=8050 bondevn/movies
Unable to find image 'bondevn/movies:latest' locally
latest: Pulling from bondevn/movies
640e0ad7f19e: Download complete 
817da3428f09: Download complete 
9a3143cd1244: Download complete 
5f7bd04d98c8: Download complete 
b1281abfd102: Download complete 
Digest: sha256:5d0d6561615e6795efd72a087ccf15111773cee76cfa0d2b4fa7504c4a2e95a0
Status: Downloaded newer image for bondevn/movies:latest
Connected to the database.
🚀 Server has been successfully launched
```

#### clone repository
```bash
git clone git@github.com:yurii-bondar/movies-cms.git
```

#### install dependencies
```bash
npm install
```

### start without docker

#### dev start with nodemon
```bash
npm run start:dev
```
#### simple start (without nodemon)
```bash
# build ts
npm run build

# start
npm start
```

### start with docker

#### build app image
```bash
npm run docker:build
```
#### start container
```bash
npm run docker:start
```
#### or immediately build and start
```bash
npm run docker:rebuild
```
### Locally, the service is launched via url: http://localhost:8000/
![About service](./imgs/about.png)

### The implemented methods can be viewed here: http://localhost:8000/docs/
![Swagger docs](./imgs/swagger.png)

### User requests

#### signup
```bash
curl -XPOST -H "Content-type: application/json" -d '{
    "email": "yurii.bondar.vn@gmail.com",
    "name": "Yurii Bondar",
    "password": "mega_pass",
    "confirmPassword": "mega_pass"
}' 'http://localhost:8000/api/v1/users/signup'


# {
#  "message": "User created successfully",
#  "user": {
#    "regDate": "2025-03-01T21:43:44.018Z",
#    "id": 1,
#    "email": "yurii.bondar.vn@gmail.com",
#    "name": "Yurii Bondar",
#    "password": "$2b$10$UBZWNJH1iX7O4xInxfXNCuF/vN2OC5I8hMqOLQ87L8IkfWG0EFBTa"
#  }
# }
```

#### signin
```bash
curl -XPOST -H "Content-type: application/json" -d '{
    "email": "yurii.bondar.vn@gmail.com",
    "password": "mega_pass"
}' 'http://localhost:8000/api/v1/users/signin'

# {
#  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
# }
```

#### refresh token
```bash
curl -XPUT -H "Content-type: application/json" -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}' 'http://localhost:8000/api/v1/users/refresh-token'

#{ "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

#### logout
```bash
curl -XDELETE -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 'http://localhost:8000/api/v1/users/logout'

# {"message":"Logged out successfully"}
```

### Movies requests

#### import movies from dataset/datasets
```bash
  curl -X POST \
  http://localhost:8000/api/v1/movies/import \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@dataset_1.txt' \
  -F 'files=@dataset_2.txt' \
  -F 'files=@dataset_3.txt' \
  -F 'files=@dataset_4.txt' \
  -F 'files=@dataset_5.txt'
  
# {
#  "message": "Movies imported successfully",
#  "datasets": {
#    "message": "Movies imported successfully",
#    "datasets": [
#      {
#        "datasetId": 1,
#        "moviesCount": 5
#      },
#      {
#        "datasetId": 2,
#        "moviesCount": 5
#      },
#      {
#        "datasetId": 3,
#        "moviesCount": 5
#      },
#      {
#        "datasetId": 4,
#        "moviesCount": 5
#      },
#      {
#        "datasetId": 5,
#        "moviesCount": 5
#      }
#    ]
#  }
# }
```
#### create movie/movies
```bash
curl -XPOST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' -H "Content-type: application/json" -d '[
    {
        "name": "Iron Man",
        "year": 2008,
        "format": "Blu-ray",
        "actors": [
            "Robert Downey Jr.",
            "Gwyneth Paltrow",
            "Jeff Bridges"
        ]
    },
    {
        "name": "The Avengers",
        "year": 2012,
        "format": "DVD",
        "actors": [
            "Robert Downey Jr.",
            "Chris Evans",
            "Scarlett Johansson"
        ]
    },
    {
        "name": "Black Panther",
        "year": 2018,
        "format": "VHS",
        "actors": [
            "Chadwick Boseman",
            "Michael B. Jordan",
            "Lupita Nyongo"
        ]
    }
]' 'http://localhost:8000/api/v1/movies'

# {
#  "message": "Movies created successfully",
#  "createdMovies": [
#    {
#      "actors": [
#        "Robert Downey Jr.",
#        "Gwyneth Paltrow",
#        "Jeff Bridges"
#      ],
#      "addDate": "2025-03-01T22:06:34.782Z",
#      "id": 26,
#      "name": "Iron Man",
#      "year": 2008,
#      "format": "Blu-ray"
#    },
#    {
#      "actors": [
#        "Robert Downey Jr.",
#        "Chris Evans",
#        "Scarlett Johansson"
#      ],
#      "addDate": "2025-03-01T22:06:34.782Z",
#      "id": 27,
#      "name": "The Avengers",
#      "year": 2012,
#      "format": "DVD"
#    },
#    {
#      "actors": [
#        "Chadwick Boseman",
#        "Michael B. Jordan",
#        "Lupita Nyongo"
#      ],
#      "addDate": "2025-03-01T22:06:34.782Z",
#      "id": 28,
#      "name": "Black Panther",
#      "year": 2018,
#      "format": "VHS"
#    }
#  ]
# }
```

#### update movie
```bash
curl -XPATCH -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' -H "Content-type: application/json" -d '{
    "year": 1999,
   "format": "DVD"
}' 'http://localhost:8000/api/v1/movies/7'

# {"message":"Movie updated"}
```

#### get movie by id
```bash
curl -XGET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' -H "Content-type: application/json" 'http://localhost:8000/api/v1/movies/4'

# {
#  "actors": [
#    "Paul Newman",
#    "George Kennedy",
#    "Strother Martin"
#  ],
#  "id": 4,
#  "name": "Cool Hand Luke",
#  "year": 1967,
#  "format": "VHS",
#  "datasetId": 1,
#  "addDate": "2025-03-01T21:58:27.887Z",
#  "source": "http://localhost:8000/datasets/1_20250301T21582_dataset_1.txt"
# }
```

#### get movies list (all supported parameters can be found in the documentation)
```bash
curl -XGET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' -H "Content-type: application/json" 'http://localhost:8000/api/v1/movies?sortBy=year&order=DESC&format=DVD'

# {
#  "count": 14,
#  "rows": [
#    {
#      "actors": [
#        "Robert Downey Jr.",
#        "Chris Evans",
#        "Scarlett Johansson"
#      ],
#      "id": 27,
#      "name": "The Avengers",
#      "year": 2012,
#      "format": "DVD",
#      "datasetId": 2,
#      "source": "http://localhost:8000/datasets/1_20250301T21582_dataset_2.txt"
#      "addDate": "2025-03-01T22:06:34.782Z",
#    },
#    [...],
#    [...],
#  ]
# }
```

#### delete movie by id
```bash
curl -XDELETE -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' -H "Content-type: application/json" 'http://localhost:8000/api/v1/movies/6'

# {"message":"Movie deleted"}
```

#### If you are more comfortable working with .http files, you can use [requests.http](requests.http)

#### caching
##### For the 'get movie by id' and 'get movies list' routes, a levelDB-based middleware cache is used. 
The request cache can be viewed in the movies.leveldb file using the following command:
```bash
# works for an application launched using the 'npm run start:dev'
 ts-node readLeveldb.ts 
```

##### and the result will be as follows:
![Cached data](./imgs/cached.png)

#### a dataset file whose value is in the source field of the movie entity
```bash
http://localhost:8000/datasets/1_20250301T21582_dataset_1.txt
```
![Dataset static file](./imgs/dataset.png)
