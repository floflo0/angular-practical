package game.restservice;

import game.dto.MapDto;
import game.exception.BadRequestException;
import game.exception.NotFoundException;
import game.model.MapEntity;
import game.repository.MapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MapService {

    private final MapRepository repository;

    public MapService(MapRepository repository) {
        this.repository = repository;
    }

    public List<String> getMapNames() {
        return repository.findAllAsList().stream()
                .map(MapEntity::getName)
                .toList();
    }

    public MapDto getMapByName(String name) {
        MapEntity e = repository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Map not found: " + name));
        return toDto(e);
    }

    public MapDto saveMap(MapDto dto) {
        validateDto(dto);

        repository.findByName(dto.getName()).ifPresent(existing -> {
            throw new BadRequestException("Map already exists: " + dto.getName());
        });

        MapEntity entity = toEntity(dto);
        MapEntity saved = repository.save(entity);
        return toDto(saved);
    }

    private void validateDto(MapDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Map name is required");
        }
        if (dto.getTiles() == null || dto.getTiles().size() != 64) {
            throw new BadRequestException("Tiles must be a list of 64 integers");
        }
        boolean invalid = dto.getTiles().stream().anyMatch(v -> v == null || v < 0 || v > 2);
        if (invalid) {
            throw new BadRequestException("Each tile value must be 0, 1 or 2");
        }
    }

    private MapDto toDto(MapEntity e) {
        return new MapDto(e.getId(), e.getName(), e.getTiles());
    }

    private MapEntity toEntity(MapDto dto) {
        MapEntity entity = new MapEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setTiles(dto.getTiles());
        return entity;
    }
}
