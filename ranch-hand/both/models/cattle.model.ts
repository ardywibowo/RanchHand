import { CollectionObject } from './collection-object.model';

export interface Cattle extends CollectionObject {
  name: string;
  location?: Location; // Deprecated
  owner?: string;
  pastLocations?: Location[];
}

export interface Location {
  latitude?: number;
  longitude?: number;
  time?: number;
}
