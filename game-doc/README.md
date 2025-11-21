# Documentation Technique – Projet Web 2

## Diagrammes UML

---

### Frontend

```mermaid
classDiagram
direction TB

    class Inventory {
	    - int bearCount
	    - int foxCount
	    - int fishCount
    }

    class MapService {
        + getMapNames() String[]
        + generateNewMap() Map
        + saveMap(Map map)
    }

    class RestService {
        + getMapNames() String[]
        + getMap(String name) Map
        + saveMap(Map map)
    }

    class GameService {
	    - String playerName
        - int score
	    - int turnId

        + createGame(String playerName, Map map)
        + selectAnimal(Animal animal)
        + placeAnimal(Tile tile)
        + terminateGame()
        + setPlayerName()
    }

    class Map {
        - String name
    }

    class Tile {
        - int x
        - int y
    }

    class TileType {
        <<enumeration>>
        PLAIN
        TREE
        WATER
    }

    class Animal {
        <<enumeration>>
        FOX
        BEAR 
        FISH
    }

    GameService "1" o-- "1" MapService : mapService
    GameService "0..1" --> "0..1" Animal : currentAnimal
    MapService "1" o-- "1" RestService : restService
    MapService "1" o-- "1" Map : currentMap
    GameService "1" *-- "1" Inventory : inventory
    Map "64" *-- "1" Tile : tiles
    TileType "0..n" <-- "1" Tile : tileType
    Animal "0..n" <-- "0..1" Tile : animal
```

---

### Backend

```mermaid
classDiagram
direction TB

    class MapController {
        + getMapNames() List~String~
        + getMapByName(String name) MapDto
        + saveMap(MapDto map) MapDto
    }

    class MapService {
        + getMapNames() List~String~
        + getMapByName(String name) MapDto
        + saveMap(MapDto map) MapDto
    }

    class MapRepository {
        + findAll() List~Map~
        + findByName(String name) Optional~Map~
        + save(Map map) Map
    }

    class Map {
        - int id
        - String name
    }

    class MapDto {
        - int id
        - String name
    }

    class TileType {
        <<enumeration>>
        PLAIN = 0
        TREE = 1
        WATER = 2
    }

    MapController "1" --> "1" MapService : mapService
    MapService "1" --> "1" MapRepository : mapRepository
    Map "1" *-- "64" TileType : tiles
    MapDto "1" *-- "64" TileType : tiles
```

---

## Diagrammes de séquence

### 🔹 Récupération des noms de maps

```mermaid
sequenceDiagram
    participant F as Frontend
    participant C as MapController
    participant S as MapService
    participant R as MapRepository

    F->>C: GET /maps/
    C->>S: getMapNames()
    S->>R: findAll()
    R-->>S: List<Map>
    S-->>C: List<String>
    C-->>F: HTTP 200 OK, List<String>
```

---

### 🔹 Récupération d’une map par son nom

```mermaid
sequenceDiagram
    participant F as Frontend
    participant C as MapController
    participant S as MapService
    participant R as MapRepository

    F->>C: GET /maps/{name}
    C->>S: getMapByName(name)
    S->>R: findByName(name)
    alt Map exists
        R-->>S: Map
        S-->>C: MapDto
        C-->>F: HTTP 200 OK, MapDto
    else Map not found
        R-->>S: null / Optional.empty
        S-->>C: null / Optional.empty
        C-->>F: HTTP 404 Not Found
    end
```

---

### 🔹 Sauvegarde d’une map

```mermaid
sequenceDiagram
    participant F as Frontend
    participant C as MapController
    participant S as MapService
    participant R as MapRepository

    F->>C: POST /maps (MapDto)
    alt Invalid MapDto
        C-->>F: HTTP 400 Bad Request
    else Valid MapDto
        C->>S: saveMap(MapDto)
        S->>R: save(Map)
        R-->>S: Map
        S-->>C: MapDto
        C-->>F: HTTP 201 Created, MapDto
    end
```

---

## Spécification OpenAPI (Backend → Frontend)

```yaml
openapi: 3.1.0
info:
  title: Projet Web 2
  version: 1.0.0
  description: |-
    Spécification de l'API REST exposée par le backend.

    Cette API permet au frontend d'intéragir avec le backend et de pouvoir récupérer les maps déjà existantes et d'en créer de nouvelles.
  license:
    name: MIT
    url: https://gitlab.insa-rennes.fr/fbartra/web2-bartra-laine/-/raw/main/LICENSE?ref_type=heads
servers:
  - url: https://127.0.0.1:8080
defaultContentType: application/json
tags:
  - name: Maps
    description: Opération sur les maps.
paths:
  /maps:
    get:
      tags:
        - Maps
      summary: Récupérer les noms des maps.
      description: Cette route permet de récupérer les noms des maps.
      responses:
        '200':
          description: Noms des maps récupérés avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MapName'
    post:
      tags:
        - Maps
      summary: Sauvegarder une map.
      description: Cette route permet de sauvegarder une map.
      requestBody:
        description: La map à sauvegarder.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Map'
        required: true
      responses:
        '201':
          description: Map sauvegardée avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Map'
        '400':
          description: Body de la requête invalide.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /maps/by-name:
    get:
      tags:
        - Maps
      summary: Récupérer une map à partir de son nom.
      description: Cette route permet de récupérer une map à partir de son nom.
      parameters:
        - name: name
          in: query
          description: Nom de la map.
          required: true
          schema:
            $ref: '#/components/schemas/MapName'
      responses:
        '200':
          description: Map trouvée.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Map'
        '404':
          description: Aucune map trouvée.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    MapName:
      type: string
      description: Nom de la map.
      examples:
        - Map 1
        - Map 2
    Map:
      type: object
      description: Une map du jeu avec un nom et les cases qui la compose.
      properties:
        id:
          type: integer
          description: Identifiant unique de la map.
          format: int64
          minimum: 1
        name:
          $ref: '#/components/schemas/MapName'
        tiles:
          type: array
          description: Tableau de 8 par 8 contenant les types des cases.
          items:
            $ref: '#/components/schemas/TileType'
          minItems: 64
          maxItems: 64
      required:
        - id
        - name
        - tiles
    TileType:
      type: integer
      description: >
        Les différents types de cases dans une map:

        - `0` - Plain.
        - `1` - Tree.
        - `2` - Water.
      enum: [0, 1, 2]
    Error:
      type: object
      description: Erreur renvoyée par le serveur.
      properties:
        code:
          type: string
        message:
          type: string
      required:
        - code
        - message
```