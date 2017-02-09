export default {
  storage: {
    app: {
      setup: '@App:setup',
      tutorial: '@App:tutorial',
      tutorialVersion: '@App:tutorialVersion'
    },
    user: {
      loggedIn: '@User:loggedIn',
      token: '@User:token'
    }
  },
  maps: {
    lat: 27.568640,
    lng: -33.461281,
    bbox: {
      type: 'Polygon',
      coordinates: [
        [
          [-147.65625, -51.8357775204525],
          [-147.65625, 70.959697166864],
          [159.9609375, 70.959697166864],
          [159.9609375, -51.8357775204525],
          [-147.65625, -51.8357775204525]
        ]
      ]
    }
  }
};