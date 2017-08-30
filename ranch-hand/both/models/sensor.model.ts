import { CollectionObject } from './collection-object.model';
import { Location } from './cattle.model';

export interface Sensor extends CollectionObject {
  id: string;
  location?: Location;
}
