package game.controller;

import game.dto.MapDto;
import game.exception.BadRequestException;
import game.exception.NotFoundException;
import game.restservice.MapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/game")
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

    // GET /maps/by-name?name=...
    @GetMapping("/by-name")
    public ResponseEntity<MapDto> getMapByName(@RequestParam("name") String name) {
        try {
            MapDto dto = service.getMapByName(name);
            return ResponseEntity.ok(dto);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // POST /maps -> create (or update if id present)
    @PostMapping
    public ResponseEntity<?> saveMap(@RequestBody MapDto mapDto) {
        try {
            MapDto saved = service.saveMap(mapDto);
            HttpStatus status = (mapDto.getId() == null) ? HttpStatus.CREATED : HttpStatus.OK;
            return ResponseEntity.status(status).body(saved);
        } catch (BadRequestException e) {
            Map<String, String> err = new HashMap<>();
            err.put("code", "BAD_REQUEST");
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }
}
