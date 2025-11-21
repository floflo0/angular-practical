package game.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "maps")
public class MapEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @ElementCollection
    @CollectionTable(name = "map_tiles", joinColumns = @JoinColumn(name = "map_id"))
    @Column(name = "tile_value", nullable = false)
    private List<Integer> tiles = new ArrayList<>();

    public MapEntity() {}

    public MapEntity(String name, List<Integer> tiles) {
        this.name = name;
        this.tiles = tiles;
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
        return tiles;
    }

    public void setTiles(List<Integer> tiles) {
        this.tiles = tiles;
    }

    @Override
    public String toString() {
        return "MapEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tiles=" + tiles +
                '}';
    }
}
