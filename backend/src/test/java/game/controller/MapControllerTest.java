package game.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import game.dto.MapDto;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MapControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    MapRepository repo;

    /*
    Liste des tests :
    1. createMap_success
    2. createMap_duplicateName
    3. createMap_invalidTiles
    4. createMap_emptyName
    5. getMapByName_found
    6. getMapByName_notFound
    7. getAllMapNames
    */

    private List<Integer> tiles() {
        return Collections.nCopies(64, 1);
    }

    @BeforeEach
    void setup() {
        repo.deleteAll();
        System.out.println("=== Starting GameControllerTest ===");
    }

    @Test
    void createMap_success() throws Exception {
        MapDto dto = new MapDto(null, "testMap", tiles());
        String json = mapper.writeValueAsString(dto);

        System.out.println("SENDING: POST /api/game\nPayload: " + json);

        mockMvc.perform(post("/api/game")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON with name 'testMap'");
                });
    }

    @Test
    void createMap_duplicateName() throws Exception {
        repo.save(new game.model.MapEntity("testMap", tiles()));

        MapDto dto = new MapDto(null, "testMap", tiles());
        String json = mapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/game")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request");
                });
    }


    @Test
    void createMap_invalidTiles() throws Exception {
        MapDto dto = new MapDto(null, "badTiles", List.of(1,2));
        String json = mapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/game")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request for invalid tiles");
                });
    }

    @Test
    void createMap_emptyName() throws Exception {
        MapDto dto = new MapDto(null, "   ", tiles());
        String json = mapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/game")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : 400 Bad Request for empty name");
                });
    }

    @Test
    void getMapByName_found() throws Exception {
        MapDto dto = new MapDto(null, "foundMap", tiles());
        repo.save(new game.model.MapEntity(dto.getName(), dto.getTiles()));

        mockMvc.perform(get("/api/game/by-name")
                        .param("name", "foundMap"))
                .andExpect(status().isOk())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON with name 'foundMap'");
                });
    }

    @Test
    void getMapByName_notFound() throws Exception {
        mockMvc.perform(get("/api/game/by-name")
                        .param("name", "doesNotExist"))
                .andExpect(status().isNotFound())
                .andDo(result -> {
                    int status = result.getResponse().getStatus();
                    System.out.println("RETRIEVED: status " + status);
                    System.out.println("EXPECTED : 404 Not Found");
                });
    }

    @Test
    void getAllMapNames() throws Exception {
        mockMvc.perform(get("/api/game"))
                .andExpect(status().isOk())
                .andDo(result -> {
                    String retrieved = result.getResponse().getContentAsString();
                    System.out.println("RETRIEVED: " + retrieved);
                    System.out.println("EXPECTED : JSON array of map names");
                });
    }
}
