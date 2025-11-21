package game.restservice;

import game.dto.MapDto;
import game.exception.BadRequestException;
import game.exception.NotFoundException;
import game.model.MapEntity;
import game.repository.MapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/*
Liste des tests :
1. getMapNames_success
2. getMapByName_found
3. getMapByName_notFound
4. saveMap_create_success
5. saveMap_create_duplicateName
6. saveMap_update_existing
7. saveMap_invalidTiles_wrongSize
8. saveMap_invalidTiles_badValue
9. saveMap_emptyName
*/

class MapServiceTest {

    private MapRepository repo;
    private MapService service;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(MapRepository.class);
        service = new MapService(repo);
        System.out.println("=== Setup MapServiceTest ===");
    }

    private List<Integer> validTiles() {
        return Collections.nCopies(64, 1);
    }

    @Test
    void getMapNames_success() {
        List<MapEntity> list = List.of(
                new MapEntity("map1", validTiles()),
                new MapEntity("map2", validTiles())
        );
        when(repo.findAllAsList()).thenReturn(list);

        List<String> retrieved = service.getMapNames();
        List<String> expected = List.of("map1", "map2");

        System.out.println("RETRIEVED: " + retrieved);
        System.out.println("EXPECTED : " + expected);

        assertEquals(expected, retrieved);
    }

    @Test
    void getMapByName_found() {
        MapEntity entity = new MapEntity("map1", validTiles());
        when(repo.findByName("map1")).thenReturn(Optional.of(entity));

        MapDto retrieved = service.getMapByName("map1");
        MapDto expected = new MapDto(null, "map1", validTiles());

        System.out.println("RETRIEVED: " + retrieved);
        System.out.println("EXPECTED : " + expected);

        assertEquals(expected.getName(), retrieved.getName());
        assertEquals(expected.getTiles(), retrieved.getTiles());
    }

    @Test
    void getMapByName_notFound() {
        when(repo.findByName("unknown")).thenReturn(Optional.empty());

        try {
            service.getMapByName("unknown");
        } catch (NotFoundException ex) {
            System.out.println("RETRIEVED: NotFoundException with message '" + ex.getMessage() + "'");
            System.out.println("EXPECTED : NotFoundException");
        }
    }

    @Test
    void saveMap_create_success() {
        MapDto dto = new MapDto(null, "newMap", validTiles());
        MapEntity saved = new MapEntity("newMap", validTiles());
        saved.setId(10);

        when(repo.existsByName("newMap")).thenReturn(false);
        when(repo.save(any())).thenReturn(saved);

        MapDto retrieved = service.saveMap(dto);
        MapDto expected = new MapDto(10, "newMap", validTiles());

        System.out.println("RETRIEVED: " + retrieved);
        System.out.println("EXPECTED : " + expected);

        assertEquals(expected.getId(), retrieved.getId());
        assertEquals(expected.getName(), retrieved.getName());
        assertEquals(expected.getTiles(), retrieved.getTiles());
    }

    @Test
    void saveMap_update_existing() {
        MapDto dto = new MapDto(1, "updatedMap", validTiles());
        MapEntity saved = new MapEntity("updatedMap", validTiles());
        saved.setId(1);

        when(repo.save(any())).thenReturn(saved);

        MapDto retrieved = service.saveMap(dto);
        MapDto expected = new MapDto(1, "updatedMap", validTiles());

        System.out.println("RETRIEVED: " + retrieved);
        System.out.println("EXPECTED : " + expected);

        assertEquals(expected.getId(), retrieved.getId());
        assertEquals(expected.getName(), retrieved.getName());
    }

    @Test
    void saveMap_create_duplicateName() {
        MapDto dto = new MapDto(null, "existing", validTiles());

        when(repo.existsByName("existing")).thenReturn(true);

        try {
            service.saveMap(dto);
        } catch (BadRequestException ex) {
            System.out.println("RETRIEVED: BadRequestException with message '" + ex.getMessage() + "'");
            System.out.println("EXPECTED : BadRequestException");
        }
    }

    @Test
    void saveMap_invalidTiles_wrongSize() {
        MapDto dto = new MapDto(null, "name", List.of(1, 2));

        try {
            service.saveMap(dto);
        } catch (BadRequestException ex) {
            System.out.println("RETRIEVED: BadRequestException with message '" + ex.getMessage() + "'");
            System.out.println("EXPECTED : BadRequestException for invalid tile size");
        }
    }

    @Test
    void saveMap_invalidTiles_badValue() {
        List<Integer> tiles = new ArrayList<>(validTiles());
        tiles.set(0, 99);

        MapDto dto = new MapDto(null, "name", tiles);

        try {
            service.saveMap(dto);
        } catch (BadRequestException ex) {
            System.out.println("RETRIEVED: BadRequestException with message '" + ex.getMessage() + "'");
            System.out.println("EXPECTED : BadRequestException for tile value out of range");
        }
    }

    @Test
    void saveMap_emptyName() {
        MapDto dto = new MapDto(null, "   ", validTiles());

        try {
            service.saveMap(dto);
        } catch (BadRequestException ex) {
            System.out.println("RETRIEVED: BadRequestException with message '" + ex.getMessage() + "'");
            System.out.println("EXPECTED : BadRequestException for empty name");
        }
    }
}
