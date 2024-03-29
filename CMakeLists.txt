cmake_minimum_required(VERSION 3.5)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED YES)
set(CMAKE_CXX_EXTENSIONS NO)

add_compile_options(
        -W
        -Wall
        -Wcast-qual
        -Wextra
        -Wsign-compare
        -Wundef
        -Wpointer-arith
        -Wwrite-strings
        -Wredundant-decls
        -Wformat-security
        -Wformat=2
        -Winit-self
        -Wnon-virtual-dtor

        # Often parameters are unused, which is fine.
        -Wno-unused-parameter
        # We use 'ABCD' multichar for SaveLoad chunks identifiers
        -Wno-multichar

        # Compilers complains about that we break strict-aliasing.
        #  On most places we don't see how to fix it, and it doesn't
        #  break anything. So disable strict-aliasing to make the
        #  compiler all happy.
        -fno-strict-aliasing
)

if(${EMSCRIPTEN})
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Oz -s USE_SDL=2")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Oz -s USE_SDL=2")
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} \
        -Oz -s USE_SDL=2 \
        --emit-symbol-map \
        -s ASSERTIONS=0 \
        -s SAFE_HEAP=0 \
        -s WASM_MEM_MAX=134217728 \
        -s TOTAL_MEMORY=134217728 \
        -s ALLOW_MEMORY_GROWTH=0 \
        -s INVOKE_RUN=1 \
        -s EXPORTED_FUNCTIONS='[\"_main\", \"_em_openttd_add_server\"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"cwrap\"]' \
        -s NO_EXIT_RUNTIME=1 \
        -s FORCE_FILESYSTEM=1 \
        -s DISABLE_EXCEPTION_CATCHING=0 \
        -s ERROR_ON_UNDEFINED_SYMBOLS=1")

    add_definitions(-DNDEBUG)
else()
    set(CMAKE_C_COMPILER "/usr/bin/clang")
    set(CMAKE_CXX_COMPILER "/usr/bin/clang++")

    add_definitions(-D_DEBUG)
endif()


# -D_FORTIFY_SOURCE=2
# -DPERSONAL_DIR=\".openttd\"
# -DGLOBAL_DATA_DIR=\"/usr/local/share/games/openttd\"
# -DWITH_PERSONAL_DIR
# -DWITH_PNG
# -DWITH_ZLIB
add_definitions(
        -DNO_THREADS
        -DTTD_ENDIAN=TTD_LITTLE_ENDIAN
        -DUNIX
        -DWITH_SDL2
)

include_directories(
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/include"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/ai"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/game"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/template"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated/script"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated/script/api"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated/script/api/ai"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated/script/api/game"
        "${CMAKE_CURRENT_LIST_DIR}/build-host/generated/script/api/template"
)

set(SOURCES_F_EXCEPTIONS
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_controller.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_execmode.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_object.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_priorityqueue.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_testmode.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_text.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/script_info.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/script_instance.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/script_scanner.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/squirrel.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/strgen/strgen_base.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqapi.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqcompiler.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqvm.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqbaselib.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqclass.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqobject.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqstate.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_text.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc/countedobj.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/oldloader.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/oldloader_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/saveload.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/crashlog.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/genworld.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/spritecache.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/openttd.cpp"

        # easy to fix
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_info.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_instance.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_scanner.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_instance.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_scanner.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_info.cpp"
        )

set(SOURCES_F_NO_EXCEPTIONS
        "${CMAKE_CURRENT_LIST_DIR}/build/generated/rev.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_accounting.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_admin.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_airport.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_base.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_basestation.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_bridge.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_bridgelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_cargo.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_cargolist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_cargomonitor.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_client.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_clientlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_company.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_companymode.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_date.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_depotlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_engine.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_enginelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_error.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_event.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_event_types.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_game.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_gamesettings.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_goal.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_group.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_grouplist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_industry.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_industrylist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_industrytype.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_industrytypelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_infrastructure.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_list.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_log.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_marine.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_news.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_order.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_rail.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_railtypelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_road.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_roadtypelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_sign.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_signlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_station.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_stationlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_story_page.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_storypagelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_storypageelementlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_subsidy.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_subsidylist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_tile.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_tilelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_town.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_townlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_tunnel.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_vehicle.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_vehiclelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_viewport.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_waypoint.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_waypointlist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/api/script_window.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/script_config.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/script_info_dummy.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/script/squirrel_std.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/md5/md5.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/sqstdlib/sqstdaux.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/sqstdlib/sqstdmath.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqdebug.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqfuncstate.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqlexer.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqmem.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/3rdparty/squirrel/squirrel/sqtable.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_config.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_core.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ai/ai_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/32bpp_anim.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/32bpp_base.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/32bpp_optimized.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/32bpp_simple.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/8bpp_base.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/8bpp_optimized.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/8bpp_simple.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/blitter/null.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/alloc_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/bitmath_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/geometry_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/math_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/pool_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/core/random_func.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_config.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/game/game_core.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/demands.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/flowmapper.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/linkgraph.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/linkgraph_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/linkgraphjob.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/linkgraphschedule.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/mcf.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/linkgraph/refresh.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc/dbg_helpers.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc/getoptdata.cpp"
#        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/music/extmidi.cpp"
#        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/music/midifile.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/music/null_m.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/address.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/core.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/host.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/packet.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp_admin.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp_connect.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp_content.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp_game.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/tcp_http.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/core/udp.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_admin.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_chat_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_client.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_command.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_content.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_content_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_gamelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_server.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/network/network_udp.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/os/unix/crashlog_unix.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/os/unix/unix.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/npf/aystar.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/npf/npf.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/npf/queue.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/yapf/yapf_rail.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/yapf/yapf_road.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pathfinder/yapf/yapf_ship.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/afterload.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/ai_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/airport_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/animated_tile_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/autoreplace_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/cargomonitor_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/cargopacket_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/cheat_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/company_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/depot_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/economy_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/engine_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/game_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/gamelog_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/goal_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/group_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/industry_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/labelmaps_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/linkgraph_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/map_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/misc_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/newgrf_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/object_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/order_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/signs_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/station_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/storage_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/strings_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/story_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/subsidy_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/town_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/vehicle_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/saveload/waypoint_sl.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/sound/sdl2_s.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/sound/null_s.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/spriteloader/grf.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/video/sdl2_v.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/video/sdl2_default_v.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/video/dedicated_v.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/video/null_v.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/video/video_driver.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/widgets/dropdown.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/aircraft_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/aircraft_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/airport.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/airport_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/animated_tile.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/articulated_vehicles.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/autoreplace.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/autoreplace_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/autoreplace_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/base_consist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/bmp.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/bootstrap_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/bridge_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/bridge_map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/build_vehicle_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cargoaction.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cargomonitor.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cargopacket.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cargotype.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cheat.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cheat_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/clear_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/command.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/company_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/company_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/console.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/console_cmds.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/console_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/cpu.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/currency.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/date.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/date_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/debug.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/dedicated.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/depot.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/depot_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/depot_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/disaster_vehicle.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/dock_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/driver.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/economy.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/effectvehicle.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/elrail.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/engine.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/engine_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/error_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/fileio.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/fios.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/fios_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/fontcache.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/framerate_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/gamelog.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/genworld_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/gfx.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/gfx_layout.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/gfxinit.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/goal.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/goal_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/graph_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ground_vehicle.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/group_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/group_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/heightmap.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/highscore.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/highscore_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/hotkeys.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/industry_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/industry_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ini.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ini_load.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/intro_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/landscape.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/main_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/misc_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/mixer.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/music.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/music_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_airport.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_airporttiles.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_canal.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_cargo.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_commons.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_config.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_debug_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_engine.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_generic.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_house.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_industries.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_industrytiles.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_object.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_profiling.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_railtype.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_roadtype.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_sound.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_spritegroup.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_station.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_storage.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_text.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_town.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/newgrf_townname.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/news_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/object_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/object_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/order_backup.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/order_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/order_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/osk_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/pbs.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/progress.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/rail.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/rail_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/rail_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/road.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/road_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/road_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/road_map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/roadstop.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/roadveh_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/roadveh_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/screenshot_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/screenshot.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/settings.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/settings_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ship_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/ship_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/signal.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/signs.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/signs_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/signs_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/smallmap_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/sound.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/sprite.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/station.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/station_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/station_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/statusbar_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/story.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/story_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/string.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/stringfilter.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/strings.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/subsidy.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/subsidy_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/terraform_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/terraform_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/textbuf.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/texteff.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/textfile_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tgp.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tile_map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tilearea.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/timetable_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/timetable_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/toolbar_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/town_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/town_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/townname.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/train_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/train_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/transparency_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tree_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tree_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tunnel_map.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/tunnelbridge_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/vehicle.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/vehicle_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/vehicle_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/vehiclelist.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/viewport.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/viewport_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/void_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/water_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/waypoint.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/waypoint_cmd.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/waypoint_gui.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/widget.cpp"
        "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/src/window.cpp"
        )

set(SOURCES_OVERRIDES
        "${CMAKE_CURRENT_LIST_DIR}/src/emmidi.cpp"
        )

if(${EMSCRIPTEN})
    set_source_files_properties(${SOURCES_F_NO_EXCEPTIONS} PROPERTIES COMPILE_FLAGS "${CMAKE_CXX_FLAGS} -fno-exceptions -s DISABLE_EXCEPTION_CATCHING=1")
    set_source_files_properties(${SOURCES_F_EXCEPTIONS} PROPERTIES COMPILE_FLAGS "${CMAKE_CXX_FLAGS} -s DISABLE_EXCEPTION_CATCHING=0")
else()
    set_source_files_properties(${SOURCES_F_NO_EXCEPTIONS} PROPERTIES COMPILE_FLAGS "${CMAKE_CXX_FLAGS} -fno-exceptions")
    set_source_files_properties(${SOURCES_F_EXCEPTIONS} PROPERTIES COMPILE_FLAGS "${CMAKE_CXX_FLAGS}")
endif()

set(SOURCES ${SOURCES_F_NO_EXCEPTIONS} ${SOURCES_F_EXCEPTIONS} ${SOURCES_OVERRIDES})

if(${EMSCRIPTEN})
    add_custom_target(data
            COMMAND rm -rf "${CMAKE_CURRENT_LIST_DIR}/res_gen"
            COMMAND rm -rf "${CMAKE_CURRENT_LIST_DIR}/res_linux"
            COMMAND rm -rf "${CMAKE_CURRENT_LIST_DIR}/emscripten/async"
            COMMAND mkdir "${CMAKE_CURRENT_LIST_DIR}/res_gen"
            COMMAND mkdir "${CMAKE_CURRENT_LIST_DIR}/res_gen/lang"
            COMMAND mkdir -p "${CMAKE_CURRENT_LIST_DIR}/emscripten/async"
            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/res_src/baseset" "${CMAKE_CURRENT_LIST_DIR}/res_gen/baseset"
            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/bin/ai" "${CMAKE_CURRENT_LIST_DIR}/res_gen/ai"
            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/OpenTTD/bin/game" "${CMAKE_CURRENT_LIST_DIR}/res_gen/game"
            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/build/lang/english.lng" "${CMAKE_CURRENT_LIST_DIR}/res_gen/lang/english.lng"
            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/res_src/open_msx" "${CMAKE_CURRENT_LIST_DIR}/emscripten/async/open_msx"

            COMMAND cp -r "${CMAKE_CURRENT_LIST_DIR}/res_gen" "${CMAKE_CURRENT_LIST_DIR}/res_linux"
            COMMAND python "${EMSCRIPTEN_ROOT_PATH}/tools/file_packager.py" bin.data._.js --no-heap-copy --from-emcc --preload "${CMAKE_CURRENT_LIST_DIR}/res_gen@" --js-output=bin.data.js)

    add_library(bin-obj OBJECT ${SOURCES})

    add_executable(wbin $<TARGET_OBJECTS:bin-obj>)
    set_target_properties(wbin PROPERTIES SUFFIX .js)
    set_target_properties(wbin PROPERTIES LINK_FLAGS "-s WASM=1")

    add_executable(hbin $<TARGET_OBJECTS:bin-obj>)
    set_target_properties(hbin PROPERTIES SUFFIX .html)
    set_target_properties(hbin PROPERTIES LINK_FLAGS "-s WASM=1 --preload-file ${CMAKE_CURRENT_LIST_DIR}/res_gen@")
else()
    add_executable(bin ${SOURCES})
    target_link_libraries(bin SDL2)
endif()
