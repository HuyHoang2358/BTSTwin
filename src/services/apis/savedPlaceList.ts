import type { IdParam, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_NOTES, API_PLACES, API_SAVED_PLACE_LISTS } from '@/services/apiPath';

export type SavedPlaceListResType = {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  slug: string;
  iconPath: any;
  description: string;
  deleted: boolean;
};

export type SavedPlaceListData = {
  name: string;
};

export type Place = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  type: string;
  point: Point;
  height: any;
  photos: any[];
  location: string;
};

export interface Point {
  x: number;
  y: number;
}

export type Note = {
  content: string;
};

export const fetchSavedPlaceLists = (): WrapperResponse<SavedPlaceListResType[]> =>
  client.get(API_SAVED_PLACE_LISTS);

export const fetchPlaceDetail = (id: number): WrapperResponse<Place> =>
  client.get(`${API_PLACES}/${id}`);

export const fetchSavedPlaceListsOfPlace = (id: number): WrapperResponse<SavedPlaceListResType[]> =>
  client.get(`${API_PLACES}/saved_place_lists_of_place/${id}`);

export const fetchNote = (id: number): WrapperResponse<Note> =>
  client.get(`${API_NOTES}/get-by-places/${id}`);

export const addNoteToPlace = ({ id, content }: { id: number; content: string }) =>
  client.post(`${API_PLACES}/${id}/note`, { content });

export const addPlaceToSavedPlaceList = ({
  savedListId,
  placeId,
}: {
  savedListId: number;
  placeId: number;
}) => client.post(`${API_SAVED_PLACE_LISTS}/${savedListId}/places/${placeId}`);

export const removePlaceFromSavedPlaceList = ({
  savedListId,
  placeId,
}: {
  savedListId: number;
  placeId: number;
}) => client.delete(`${API_SAVED_PLACE_LISTS}/${savedListId}/places/${placeId}`);

export const createSavedPlaceList = (data: SavedPlaceListData) =>
  client.post(API_SAVED_PLACE_LISTS, data);

export const updateSavedPlaceList = (data: SavedPlaceListData & IdParam) =>
  client.put(`${API_SAVED_PLACE_LISTS}/${data.id}`, data);

export const deleteSavedPlaceList = (id: number) => client.delete(`${API_SAVED_PLACE_LISTS}/${id}`);

export const fetchPlacesInLocation = (selectedSavedPlaceListId: number): WrapperResponse<Place[]> =>
  client.get(`${API_SAVED_PLACE_LISTS}/${selectedSavedPlaceListId}/places`);
