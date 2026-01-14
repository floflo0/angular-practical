package game.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "maps")
public class MapEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name;
    @Column(name = "tiles", nullable = false, length = 64)
    private String tilesData;

    public MapEntity() {}

    public MapEntity(String name, List<Integer> tiles) {
        this.name = name;
        setTiles(tiles);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getTiles() {
        if (tilesData == null || tilesData.isEmpty()) {
            return new ArrayList<>();
        }
        return tilesData.chars()
                .mapToObj(Character::getNumericValue)
                .collect(Collectors.toList());
    }

    public void setTiles(List<Integer> tiles) {
        if (tiles == null || tiles.isEmpty()) {
            this.tilesData = "";
            return;
        }
        this.tilesData = tiles.stream()
                .map(String::valueOf)
                .collect(Collectors.joining());
    }

    @Override
    public String toString() {
        return "MapEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tiles=" + getTiles() +
                '}';
    }
}
