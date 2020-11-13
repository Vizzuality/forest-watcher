// @flow
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Theme from 'config/theme';

/**
  Presents the information screen modally with default animation
  @param {Object} passProps - The props to pass into the information screen
  @param {string} passProps.title - The title to display on the screen
  @param {string} passProps.body - The body to display in the screen
 */
export function presentInformationModal(passProps: { title: string, body: string }) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: 'ForestWatcher.Information',
            passProps,
            options: {
              animations: Theme.navigationAnimations.fadeModal,
              layout: {
                backgroundColor: 'transparent',
                componentBackgroundColor: 'rgba(0,0,0,0.74)'
              },
              screenBackgroundColor: 'rgba(0,0,0,0.74)',
              modalPresentationStyle: 'overCurrentContext'
            }
          }
        }
      ]
    }
  });
}

export function showWelcomeScreen() {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: 'ForestWatcher.Welcome',
            options: {
              animations: Theme.navigationAnimations.fadeModal,
              layout: {
                backgroundColor: 'transparent',
                componentBackgroundColor: 'rgba(0,0,0,0.74)'
              },
              screenBackgroundColor: 'rgba(0,0,0,0.74)',
              // Has to be overFullScreen on iOS otherwise viewDidAppear not called on presenting VC
              // Android doesn't support `overFullScreen`
              modalPresentationStyle: Platform.OS === 'ios' ? 'overFullScreen' : 'overCurrentContext'
            }
          }
        }
      ]
    }
  });
}

export function showLocationPermissionsScreen() {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: 'ForestWatcher.LocationPermissions',
            options: {
              animations: Theme.navigationAnimations.fadeModal,
              layout: {
                backgroundColor: 'transparent',
                componentBackgroundColor: 'rgba(0,0,0,0.74)'
              },
              screenBackgroundColor: 'rgba(0,0,0,0.74)',
              // Has to be overFullScreen on iOS otherwise viewDidAppear not called on presenting VC
              // Android doesn't support `overFullScreen`
              modalPresentationStyle: Platform.OS === 'ios' ? 'overFullScreen' : 'overCurrentContext'
            }
          }
        }
      ]
    }
  });
}

export function showFAQSection(parentComponentId: string, title: string) {
  Navigation.push(parentComponentId, {
    component: {
      name: 'ForestWatcher.FaqCategories',
      options: {
        topBar: {
          title: {
            text: title
          }
        }
      }
    }
  });
}

export function launchAppRoot(screen: string) {
  return Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screen
            }
          }
        ]
      }
    }
  });
}
