import {
  YMaps,
  Map,
  ZoomControl,
  Clusterer,
  Placemark,
  Polyline,
  Polygon,
} from "@pbe/react-yandex-maps";

import { Container, Button, Row, Col } from "react-bootstrap";

import OffCanvas from "Shared/components/OffCanvas";
import ContextMenu from "Shared/components/ContextMenu";
import MarkerForm from "Shared/components/MarkerForm";
import LineForm from "Shared/components/LineForm";

import useMapHandler from "Features/yandex/useMapHandler";
import {
  MARKER_IMAGES,
  MAP_DEFAULT_CENTER,
  PLACEMARK_IMAGE_SIZE,
  POLYLINE_DEFAULT_WIDTH,
  OFFCANVAS_MODE,
} from "Shared/constants/common";

export default function YandexMaps() {
  const {
    lines,
    polygons,
    placemarks,
    selectedLine,
    selectedPlacemark,
    isOffCanvasShown,
    isDrawing,
    offCanvasMode,
    handleLineSelect,
    handleMapClick,
    handleObjectSelected,
    handleOffCanvasClose,
    handlePlacemarkSelect,
    handleMarkerFieldChange,
    handleLineFieldChange,
    handleStartDrawPolygon,
    handleStartDraw,
    handleStopDraw,
  } = useMapHandler();

  return (
    <YMaps>
      {isDrawing && (
        <Container className="p-1">
          <Row>
            <Col xs={8} className="d-flex align-items-center">
              <p>Режим рисования</p>
            </Col>
            <Col xs={4}>
              <Button onClick={handleStopDraw}>Завершить рисование</Button>
            </Col>
          </Row>
        </Container>
      )}
      <Map
        defaultState={{
          center: MAP_DEFAULT_CENTER,
          zoom: 15,
        }}
        width="100%"
        height="100vh"
        modules={["geoObject.addon.editor", "geoObject.addon.hint"]}
        onClick={handleMapClick}
      >
        <Clusterer
          options={{
            preset: "islands#invertedVioletClusterIcons",
            groupByCoordinates: false,
          }}
        >
          {placemarks.map((p) => {
            return (
              <Placemark
                key={p.id}
                geometry={p.coords}
                options={{
                  iconImageSize: PLACEMARK_IMAGE_SIZE,
                  iconLayout: "default#image",
                  iconImageHref: MARKER_IMAGES[p.markerType],
                }}
                properties={{
                  hintContent: `<b>${p.title}</b><br /> <span>${p.description}</span>`,
                }}
                onClick={() => handlePlacemarkSelect(p.id)}
              />
            );
          })}
        </Clusterer>
        {lines.map((line) => {
          return (
            <Polyline
              key={line.id}
              geometry={line.coords}
              options={{
                strokeWidth: POLYLINE_DEFAULT_WIDTH,
                strokeColor: line.color,
                editorMaxPoints: Infinity,
              }}
              onClick={(e) => handleLineSelect(e, line.id)}
              properties={{
                hintContent: `<b>${line.title}</b><br /> <span>${line.description}</span>`,
              }}
              // instanceRef={(ref) => ref && !line.coords.length && handleStartDraw(ref, line.id)}
            />
          );
        })}
        {polygons.map((polygon) => {
          return (
            <Polygon
              key={polygon.id}
              geometry={polygon.coords}
              options={{
                strokeWidth: POLYLINE_DEFAULT_WIDTH,
                strokeColor: polygon.color,
                editorMaxPoints: Infinity,
              }}
              onClick={(e) => handleStartDrawPolygon(e, polygon.id)}
              properties={{
                hintContent: `<b>${polygon.title}</b><br /> <span>${polygon.description}</span>`,
              }}
            />
          );
        })}
        <ZoomControl options={{ float: "right" }} />
      </Map>
      <OffCanvas isShown={isOffCanvasShown} onClose={handleOffCanvasClose}>
        {offCanvasMode === OFFCANVAS_MODE.CONTEXT_MENU && (
          <ContextMenu onObjectSelected={handleObjectSelected} />
        )}
        {offCanvasMode === OFFCANVAS_MODE.MARKER_FORM && (
          <MarkerForm
            description={selectedPlacemark?.description}
            markerType={selectedPlacemark?.markerType}
            title={selectedPlacemark?.title}
            onTextFieldChange={handleMarkerFieldChange}
            id={selectedPlacemark?.id}
          />
        )}
        {offCanvasMode === OFFCANVAS_MODE.LINE_FORM && (
          <LineForm
            description={selectedLine?.description}
            color={selectedLine?.color}
            title={selectedLine?.title}
            onTextFieldChange={handleLineFieldChange}
            id={selectedLine?.id}
            onStartDraw={handleStartDraw}
          />
        )}
      </OffCanvas>
    </YMaps>
  );
}
