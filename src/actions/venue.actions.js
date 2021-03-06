import {
  FETCH_VENUE,
  FETCH_VENUE_SUCCESS,
  FETCH_VENUE_ERROR,
  SET_VENUE,
  FETCH_FOURSQUARE,
  FETCH_FOURSQUARE_SUCCESS,
  FETCH_FOURSQUARE_ERROR,
  FETCH_INSTAGRAM,
  FETCH_INSTAGRAM_SUCCESS,
  FETCH_INSTAGRAM_ERROR,
  CLEAR_DISPLAY_NEARBY
} from '../types';

export function getDetails() {
  return async (dispatch, getState, { api }) => {
    function onSuccess(venue) {
      dispatch({
        type: CLEAR_DISPLAY_NEARBY
      });
      dispatch({
        type: FETCH_VENUE_SUCCESS,
        payload: {
          venue: venue
        }
      });
    }

    function onError(error) {
      dispatch({
        type: FETCH_VENUE_ERROR,
        payload: {
          error
        }
      });
      return error;
    }

    try {
      dispatch({
        type: FETCH_VENUE
      });
      const place = getState().venue.venue;
      const venue = await api({
        method: 'POST',
        url: `/place/${place.id}`,
        data: {
          placeId: place.id,
          placeOnly: false
        }
      });
      onSuccess(venue.data);
    } catch (err) {
      onError(err);
    }
  };
}

export function setVenue(venueId, venueName) {
  return dispatch => {
    return dispatch({
      type: SET_VENUE,
      payload: {
        venue: {
          id: venueId,
          name: venueName
        }
      }
    });
  };
}

export function getFoursquareDetails() {
  return async (dispatch, getState, { api }) => {
    function onSuccess(venueDetails) {
      return dispatch({
        type: FETCH_FOURSQUARE_SUCCESS,
        payload: {
          venue: { ...getState().venue.venue, ...venueDetails }
        }
      });
    }

    function onError(error) {
      dispatch({
        type: FETCH_FOURSQUARE_ERROR,
        payload: {
          error
        }
      });
      return error;
    }

    try {
      dispatch({
        type: FETCH_FOURSQUARE
      });
      const place = getState().venue.venue;
      const venues = await api({
        method: 'POST',
        url: `/venue/details/${place.title}`,
        data: {
          venueId: place.id,
          title: place.title,
          latitude: place.coordinates.lat,
          longitude: place.coordinates.lng
        }
      });
      const venue = venues.data;
      return onSuccess(venue);
    } catch (err) {
      return onError(err);
    }
  };
}

export function getInstagram() {
  return async (dispatch, getState, { api }) => {
    function onSuccess(items) {
      dispatch({
        type: FETCH_INSTAGRAM_SUCCESS,
        payload: {
          instaPosts: items
        }
      });
    }

    function onError(error) {
      dispatch({
        type: FETCH_INSTAGRAM_ERROR,
        payload: {
          error
        }
      });
      return error;
    }

    try {
      dispatch({
        type: FETCH_INSTAGRAM,
        payload: {
          instaPosts: []
        }
      });
      const place = getState().venue.venue;
      const venues = await api({
        method: 'POST',
        url: `/insta/${place.title}`,
        data: {
          venueId: place.id,
          title: place.name ? place.name : place.title,
          latitude:
            place.location && place.location.lat
              ? place.location.lat
              : place.coordinates.lat,
          longitude:
            place.location && place.location.lng
              ? place.location.lng
              : place.coordinates.lng
        }
      });
      const mediaArray = venues.data.edge_location_to_media.edges.map(
        venue => ({
          id: venue.node.id,
          img: venue.node.thumbnail_src,
          title: 'insta'
        })
      );
      onSuccess(mediaArray);
    } catch (err) {
      onError(err);
    }
  };
}
