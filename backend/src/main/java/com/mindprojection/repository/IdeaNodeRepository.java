package com.mindprojection.repository;

import com.mindprojection.model.IdeaNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IdeaNodeRepository extends JpaRepository<IdeaNode, Long> {

    @Query("SELECT n FROM IdeaNode n WHERE n.parent IS NULL ORDER BY n.position ASC")
    List<IdeaNode> findRoots();
}
