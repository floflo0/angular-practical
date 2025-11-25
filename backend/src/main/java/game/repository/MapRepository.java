package game.repository;

import game.model.MapEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MapRepository extends CrudRepository<MapEntity, Integer> {
    Optional<MapEntity> findByName(String name);
    @Query("SELECT m FROM MapEntity m")
    List<MapEntity> findAllAsList();
}
