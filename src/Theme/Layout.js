import {StyleSheet} from 'react-native'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function () {
  return StyleSheet.create({
    /* Column Layouts */
    column: {
      flexDirection: 'column',
    },
    columnReverse: {
      flexDirection: 'column-reverse',
    },
    colCenter: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    colVCenter: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    colHCenter: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    /* Row Layouts */
    row: {
      flexDirection: 'row',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowVCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    rowHCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    /* Default Layouts */
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    alignItemsStart: {
      alignItems: 'flex-start',
    },
    alignItemsStretch: {
      alignItems: 'stretch',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    justifyContentAround: {
      justifyContent: 'space-around',
    },
    justifyContentBetween: {
      justifyContent: 'space-between',
    },
    scrollSpaceAround: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    scrollSpaceBetween: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    selfStretch: {
      alignSelf: 'stretch',
    },
    /* Sizes Layouts */
    fill: {
      flex: 1,
    },
    fullSize: {
      height: '100%',
      width: '100%',
    },
    fullWidth: {
      width: '100%',
    },
    fullHeight: {
      height: '100%',
    },
    oneThirdHeight: {
      height: '33%',
    },
    /* Operation Layout */
    mirror: {
      transform: [{ scaleX: -1 }],
    },
    rotate90: {
      transform: [{ rotate: '90deg' }],
    },
    rotate90Inverse: {
      transform: [{ rotate: '-90deg' }],
    },
    /*Spacing*/
    marginTop25: {
      marginTop: 25
    },
    marginHorizontal25: {
      marginHorizontal: 25
    },
    margin25: {
      margin: 25,
    },
    padding25: {
      padding: 25,
    },
    padding15: {
      padding: 15,
    },
    marginTop10: {
      marginTop: 10,
    },
    /*Backgrounds*/
    whiteBg: {
      backgroundColor: '#fff',
    },
    redBg: {
      backgroundColor: 'red',
    },
    greenBg: {
      backgroundColor: 'green',
    },
    blueBg: {
      backgroundColor: 'blue',
    },
    pinkBg: {
      backgroundColor: 'pink',
    },
    yellowBg: {
      backgroundColor: 'yellow',
    },
    textAlignCenter: {
      textAlign: 'center'
    },
    textAlignRight: {
      textAlign: 'right',
    },
    /*Stylistic - This should be moved to theme:*/
    boxShadow: {
      borderTopWidth: 1,
      borderColor: '#ededed',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      elevation: 8,
      shadowOpacity: 1,
      shadowRadius: 5,
    },
    searchRadiusWrapper: {
      marginHorizontal: 15,
      paddingVertical: 5,
    },
    typicalMap: {
      minHeight: 250,
      maxHeight: 250,
      flex: 1,
    },
    sliderBoxBanner: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1,
      paddingHorizontal: 30,
      paddingVertical: 10
    },
    sliderBoxBottomBanner: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: 1,
      paddingHorizontal: 30,
      paddingVertical: 10
    },
    sliderBoxBannerText: {
      color: 'white',
      fontWeight: '500',
      fontSize: 15,
      lineHeight: 20,
      maxHeight: 60
    },
    parkingSpotResult: {
      marginBottom: 15,
      borderRadius: 30,
      backgroundColor: '#90A4AE',
      overflow: 'hidden',
      height: 150,
    }
  })
}
