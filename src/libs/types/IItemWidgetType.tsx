import {WidgetTypeEnum} from './WidgetTypeEnum';
import {WidgetCarouselAttachment} from './IFetchedWidgetData';

export interface IItemWidgetTypeValues {
  url?: string;
  title?: string;
  image?: string;
  text?: string;
  images?: string[];
  email?: string;
  phoneNumber?: string;
  caption?: string;
  attachmentId?: string;
  urlThumbnail?: string;
  video?: string;
  content?: string;
  key?: string;
  value?: string;
  latitude?: number;
  longitude?: number;
  widgetCarouselAttachment?: WidgetCarouselAttachment[];
}

export interface IItemWidgetType {
  id: number;
  idEditor: string;
  order: number;
  width: string;
  type: WidgetTypeEnum;
  value?: IItemWidgetTypeValues | null;
}
