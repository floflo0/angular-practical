package game.config;

import game.dto.MapDto;
import game.restservice.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final MapService service;

    public DataInitializer(MapService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing data...");

        try {
            createInitialMaps();
            logger.info("Data initialization completed.");
        } catch (Exception e) {
            logger.error("Data initialization failed.", e);
        }
    }

    private void createInitialMaps(){
        String nom1 = "Map-Chill";
        List<Integer> tiles1 = Arrays.asList(
                2, 2, 2, 0, 0, 0, 1, 1,
                2, 2, 2, 2, 2, 0, 1, 1,
                1, 1, 2, 2, 2, 2, 2, 1,
                1, 1, 0, 2, 2, 2, 2, 2,
                1, 0, 0, 0, 0, 0, 2, 2,
                0, 0, 1, 1, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 1, 0, 0,
                1, 1, 1, 1, 1, 1, 1, 0
        );
        MapDto dto1 = new MapDto(null, nom1, tiles1);
        service.saveMap(dto1);

        String nom2 = "Map-Forest";
        List<Integer> tiles2 = Arrays.asList(
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1
        );
        MapDto dto2 = new MapDto(null, nom2, tiles2);
        service.saveMap(dto2);

        String nom3 = "Map-Grid";
        List<Integer> tiles3 = Arrays.asList(
                2, 0, 2, 0, 2, 0, 2, 0,
                0, 1, 0, 1, 0, 1, 0, 1,
                2, 0, 2, 0, 2, 0, 2, 0,
                0, 1, 0, 1, 0, 1, 0, 1,
                2, 0, 2, 0, 2, 0, 2, 0,
                0, 1, 0, 1, 0, 1, 0, 1,
                2, 0, 2, 0, 2, 0, 2, 0,
                0, 1, 0, 1, 0, 1, 0, 1
        );
        MapDto dto3 = new MapDto(null, nom3, tiles3);
        service.saveMap(dto3);
    }
}
