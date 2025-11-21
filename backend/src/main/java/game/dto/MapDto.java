package game.dto;

import java.util.List;

public class MapDto {
    private Integer id;
    private String name;
    private List<Integer> tiles;

    public MapDto() {}

    public MapDto(Integer id, String name, List<Integer> tiles) {
        this.id = id;
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
        return "MapDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tiles=" + tiles +
                '}';
    }
}
