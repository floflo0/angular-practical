package game.controller;

import game.dto.MapDto;
import game.exception.BadRequestException;
import game.exception.NotFoundException;
import game.restservice.MapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("api/maps")
public class GameController {

    private final MapService service;

    public GameController(MapService service) {
        this.service = service;
    }

    // GET /maps -> list of names
    @GetMapping
    public ResponseEntity<List<String>> getMapNames() {
        return ResponseEntity.ok(service.getMapNames());
    }

    // GET /maps/by-name?name=... -> search map by name
    @GetMapping("/by-name")
    public ResponseEntity<MapDto> getMapByName(@RequestParam("name") String name) {
        try {
            MapDto dto = service.getMapByName(name);
            return ResponseEntity.ok(dto);
        } catch (NotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    // POST /maps -> create map
    @PostMapping
    public ResponseEntity<MapDto> saveMap(@RequestBody MapDto mapDto) {
        try {
            MapDto savedMap = service.saveMap(mapDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMap);
        } catch (BadRequestException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }
}
