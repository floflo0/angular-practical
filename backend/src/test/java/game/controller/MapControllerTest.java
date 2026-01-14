package game.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import game.dto.MapDto;
import game.model.MapEntity;
import game.repository.MapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
Tests List :
1. createMap_success             → create a valid map
2. createMap_duplicateName       → create a second map with the same name
3. createMap_invalidTiles        → create a map with invalid tile number (size != 64)
4. createMap_emptyName           → create a map with an empty name
5. getMapByName_found            → get an existing map by its name
6. getMapByName_notFound         → get a non-existing map
7. getAllMapNames                → get a list with all map names
*/

@SpringBootTest
@AutoConfigureMockMvc
class MapControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    MapRepository repo;

    private List<Integer> tiles() {
        return Collections.nCopies(64, 1);
    }

    @BeforeEach
    void setup() {
        repo.deleteAll();
        System.out.println("=== Starting MapControllerTest ===");
    }

    // -------------------------------------------------------------------------
    // 1. createMap_success
    // -------------------------------------------------------------------------
    @Test
    void createMap_success() throws Exception {

        MapDto dto = new MapDto(null, "testMap", tiles());
        String json = mapper.writeValueAsString(dto);

        System.out.println("SENDING: POST /api/maps\nPayload: " + json);

        mockMvc.perform(post("/api/maps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON with name 'testMap'");
                });

        assertThat(repo.count()).isEqualTo(1);
    }

    // -------------------------------------------------------------------------
    // 2. createMap_duplicateName
    // -------------------------------------------------------------------------
    @Test
    void createMap_duplicateName() throws Exception {

        repo.save(new MapEntity("testMap", tiles()));
        assertThat(repo.count()).isEqualTo(1);

        MapDto dto = new MapDto(null, "testMap", tiles());
        String json = mapper.writeValueAsString(dto);

        System.out.println("SENDING: POST /api/maps (duplicate name)\nPayload: " + json);

        mockMvc.perform(post("/api/maps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request (duplicate name)");
                });

        assertThat(repo.count()).isEqualTo(1);
    }

    // -------------------------------------------------------------------------
    // 3. createMap_invalidTiles
    // -------------------------------------------------------------------------
    @Test
    void createMap_invalidTiles() throws Exception {

        MapDto dto = new MapDto(null, "badTiles", List.of(1,2));
        String json = mapper.writeValueAsString(dto);

        System.out.println("SENDING: POST /api/maps (invalid tiles)\nPayload: " + json);

        mockMvc.perform(post("/api/maps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request (tiles != 64)");
                });

        assertThat(repo.count()).isEqualTo(0);
    }

    // -------------------------------------------------------------------------
    // 4. createMap_emptyName
    // -------------------------------------------------------------------------
    @Test
    void createMap_emptyName() throws Exception {

        MapDto dto = new MapDto(null, "   ", tiles());
        String json = mapper.writeValueAsString(dto);

        System.out.println("SENDING: POST /api/maps (empty name)\nPayload: " + json);

        mockMvc.perform(post("/api/maps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request (empty name)");
                });

        assertThat(repo.count()).isEqualTo(0);
    }

    // -------------------------------------------------------------------------
    // 5. getMapByName_found
    // -------------------------------------------------------------------------
    @Test
    void getMapByName_found() throws Exception {

        repo.save(new MapEntity("foundMap", tiles()));

        System.out.println("SENDING: GET /api/maps/by-name?name=foundMap");

        mockMvc.perform(get("/api/maps/by-name")
                        .param("name", "foundMap"))
                .andExpect(status().isOk())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON with name 'foundMap'");
                });
    }

    // -------------------------------------------------------------------------
    // 6. getMapByName_notFound
    // -------------------------------------------------------------------------
    @Test
    void getMapByName_notFound() throws Exception {

        System.out.println("SENDING: GET /api/maps/by-name?name=doesNotExist");

        mockMvc.perform(get("/api/maps/by-name")
                        .param("name", "doesNotExist"))
                .andExpect(status().isNotFound())
                .andDo(result -> {
                    int status = result.getResponse().getStatus();
                    System.out.println("RETRIEVED: status " + status);
                    System.out.println("EXPECTED : 404 Not Found");
                });
    }

    // -------------------------------------------------------------------------
    // 7. getAllMapNames
    // -------------------------------------------------------------------------
    @Test
    void getAllMapNames() throws Exception {

        repo.save(new MapEntity("A", tiles()));
        repo.save(new MapEntity("B", tiles()));

        System.out.println("SENDING: GET /api/maps");

        mockMvc.perform(get("/api/maps"))
                .andExpect(status().isOk())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON array with ['A','B']");
                });
    }
}
