-- insert query
db.karforuinfos.insert(
  [
    {
      "name" : "홍길동",
      "sabun" : "81234567",
      "tel" : "01012345678",
      "email" : "gus.kim@kt.com",
      "author" : "passenger",
      "pushToken": "12134",
      "driveInfo" : [
          {
            "route" : [
              {
                "waypoint" : "서울 구로구 개봉동 한마을아파트 정문 입구",
                "destination" : "분당 kt 본사",
                "start_time": "071000",
                "end_time" : "083000",
                "passengers" : "3",
                "status" : "ing",
                "registDate": "20190403155959"
              },
            ],
            "schedule" : [
              {
                "registKey": "20190403155959",
                "driveType" : "reservation",
                "driving" : [
                  {
                    "year" : "2019",
                    "month": [
                      {
                        "start" : "04",
                        "end" : "06"
                      },
                    ],
                    "day": [
                      {
                        "start" : "01",
                        "end" : "01"
                      },
                      {
                        "start" : "03",
                        "end" : "07"
                      },
                    ]
                  }
                ],
                "nonDriving" : "holiday"
              }
            ],
            "passengerInfo" : [
              {
                "name" : "안중근",
                "phone" : "01019190301",
                "email" : "gus.kim@kt.com"
              },
              {
                "name" : "유관순",
                "phone" : "01019190302",
                "email" : "gus.kim@kt.com"
              },
              {
                "name" : "윤봉길",
                "phone" : "01019190303",
                "email" : "gus.kim@kt.com"
              }
            ]
          }
      ],
      "carInfo" :
      {
          "owner" : "me",
          "number" : "19구 1919",
          "type" : "페라리",
          "insurance" : "personal"
      },
      "rideInfo" : "음식물반입금지, 출발시간 5분전 대기, 미 승차 시 사전연락요구, 트렁크 짐칸 필요 시 사전연락필요"
    }
  ]
);




//--------------------------------------
db.karforuinfos.insert(
  [
    {
      "name" : "김유신",
      "sabun" : "99999999",
      "tel" : "01012345678",
      "email" : "gusraccoon@gmail.com",
      "sendauth" : "2019/04/09 15:59:33",
      "verify" : "notyet",
      "author" : "passenger",
      "pushToken": "12134",
      "driveInfo" : [
          {
	 "driveInfoKey" : "201904031559590001",
            "route" :
              {
                "waypoint" : "서울 구로구 개봉동 한마을아파트 정문 입구",
                "destination" : "분당 kt 본사",
                "start_time": "071000",
                "end_time" : "083000",
                "passengers" : "3",
                "status" : "ing",
                "registDate": "20190403155959"
              },
            "schedule" :
              {
                "driveType" : "reservation",
                "drivingStartDate" : " 20190405",
	     "drivingEndDate" : "20190505",
                "nonDriving" : "holiday"
              },
            "passengerInfo" : [
              {
                "name" : "안중근",
                "phone" : "01019190301",
                "email" : "gus.kim@kt.com"
              },
              {
                "name" : "유관순",
                "phone" : "01019190302",
                "email" : "gus.kim@kt.com"
              },
              {
                "name" : "윤봉길",
                "phone" : "01019190303",
                "email" : "gus.kim@kt.com"
              }
            ]
          }
      ],
      "carInfo" :
      {
          "owner" : "me",
          "number" : "19구 1919",
          "type" : "페라리",
          "insurance" : "personal"
      },
      "rideInfo" : "음식물반입금지, 출발시간 5분전 대기, 미 승차 시 사전연락요구, 트렁크 짐칸 필요 시 사전연락필요"
    }
  ]
);
